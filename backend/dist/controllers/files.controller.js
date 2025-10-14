"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
exports.testFilesEndpoint = testFilesEndpoint;
exports.getApplicationFiles = getApplicationFiles;
exports.uploadApplicationFiles = uploadApplicationFiles;
exports.downloadFile = downloadFile;
exports.deleteApplicationFile = deleteApplicationFile;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path_1.default.join(process.cwd(), "uploads");
        try {
            await promises_1.default.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        }
        catch (error) {
            cb(error, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only PDF, Word, PNG, and JPG files are allowed.'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 5 // Max 5 files per request
    }
});
// Test endpoint to check if files controller is working
async function testFilesEndpoint(req, res) {
    res.json({
        message: "Files controller is working!",
        timestamp: new Date().toISOString()
    });
}
// Get files for an application
async function getApplicationFiles(req, res) {
    try {
        const { applicationId } = req.params;
        const files = await prisma.applicationFile.findMany({
            where: { applicationId },
            orderBy: { uploadedAt: 'desc' }
        });
        res.json(files);
    }
    catch (error) {
        console.error("Get files error:", error);
        res.status(500).json({ error: "Failed to fetch files" });
    }
}
// Upload files for an application  
async function uploadApplicationFiles(req, res) {
    try {
        const { applicationId } = req.params;
        const files = req.files;
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
            await Promise.all(files.map(file => promises_1.default.unlink(file.path).catch(() => { })));
            return res.status(404).json({ error: "Application not found" });
        }
        // Check file count limit (5 files total per application)
        if (application._count.files + files.length > 5) {
            // Clean up uploaded files
            await Promise.all(files.map(file => promises_1.default.unlink(file.path).catch(() => { })));
            return res.status(400).json({
                error: `Cannot upload ${files.length} files. Application already has ${application._count.files} files. Maximum is 5 files per application.`
            });
        }
        // Save file metadata to database
        const fileRecords = await Promise.all(files.map(file => prisma.applicationFile.create({
            data: {
                applicationId,
                originalName: file.originalname,
                fileName: file.filename,
                filePath: `uploads/${file.filename}`,
                fileSize: file.size,
                mimeType: file.mimetype
            }
        })));
        res.status(201).json({
            message: `${files.length} file(s) uploaded successfully`,
            files: fileRecords
        });
    }
    catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ error: "Failed to upload files" });
    }
}
// Download a specific file
async function downloadFile(req, res) {
    try {
        const { fileId } = req.params;
        const file = await prisma.applicationFile.findUnique({
            where: { id: fileId }
        });
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }
        const filePath = path_1.default.join(process.cwd(), file.filePath);
        // Check if file exists on disk
        try {
            await promises_1.default.access(filePath);
        }
        catch {
            return res.status(404).json({ error: "File not found on disk" });
        }
        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        res.sendFile(filePath);
    }
    catch (error) {
        console.error("Download file error:", error);
        res.status(500).json({ error: "Failed to download file" });
    }
}
// Delete a file
async function deleteApplicationFile(req, res) {
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
        const filePath = path_1.default.join(process.cwd(), file.filePath);
        await promises_1.default.unlink(filePath).catch(() => { });
        res.json({ message: "File deleted successfully" });
    }
    catch (error) {
        console.error("Delete file error:", error);
        res.status(500).json({ error: "Failed to delete file" });
    }
}
//# sourceMappingURL=files.controller.js.map