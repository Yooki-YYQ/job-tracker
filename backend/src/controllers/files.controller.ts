// backend/src/controllers/files.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word, PNG, and JPG files are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Max 5 files per request
  }
});

// Test endpoint to check if files controller is working
export async function testFilesEndpoint(req: Request, res: Response) {
  res.json({ 
    message: "Files controller is working!",
    timestamp: new Date().toISOString()
  });
}

// Get files for an application
export async function getApplicationFiles(req: Request, res: Response) {
  try {
    const { applicationId } = req.params;

    const files = await prisma.applicationFile.findMany({
      where: { applicationId },
      orderBy: { uploadedAt: 'desc' }
    });

    res.json(files);
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
}

// Upload files for an application  
export async function uploadApplicationFiles(req: Request, res: Response) {
  try {
    const { applicationId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { _count: { select: { files: true } } }
    });

    if (!application) {
      // Clean up uploaded files if application doesn't exist
      await Promise.all(files.map(file => fs.unlink(file.path).catch(() => {})));
      return res.status(404).json({ error: "Application not found" });
    }

    // Check file count limit (5 files total per application)
    if (application._count.files + files.length > 5) {
      // Clean up uploaded files
      await Promise.all(files.map(file => fs.unlink(file.path).catch(() => {})));
      return res.status(400).json({ 
        error: `Cannot upload ${files.length} files. Application already has ${application._count.files} files. Maximum is 5 files per application.` 
      });
    }

    // Save file metadata to database
    const fileRecords = await Promise.all(
      files.map(file =>
        prisma.applicationFile.create({
          data: {
            applicationId,
            fileName: file.originalname, // Store original name for display
            filePath: `uploads/${file.filename}` // Store path for access
          }
        })
      )
    );

    res.status(201).json({
      message: `${files.length} file(s) uploaded successfully`,
      files: fileRecords
    });

  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "Failed to upload files" });
  }
}

// Download a specific file
export async function downloadFile(req: Request, res: Response) {
  try {
    const { fileId } = req.params;

    const file = await prisma.applicationFile.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.join(process.cwd(), file.filePath);
    
    // Check if file exists on disk
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: "File not found on disk" });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
    
    res.sendFile(filePath);

  } catch (error) {
    console.error("Download file error:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
}

// Delete a file
export async function deleteApplicationFile(req: Request, res: Response) {
  try {
    const { fileId } = req.params;

    const file = await prisma.applicationFile.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete from database
    await prisma.applicationFile.delete({
      where: { id: fileId }
    });

    // Delete from disk (don't fail if file doesn't exist)
    const filePath = path.join(process.cwd(), file.filePath);
    await fs.unlink(filePath).catch(() => {});

    res.json({ message: "File deleted successfully" });

  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
}