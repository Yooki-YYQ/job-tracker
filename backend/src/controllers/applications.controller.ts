// backend/src/controllers/applications.controller.ts
import { Request, Response } from "express";
import { PrismaClient, ApplicationStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function getApplications(req: Request, res: Response) {
  try {
    let applications = await prisma.application.findMany({
      where: { isDeleted: false }, // Add soft delete filter
      include: {
        files: {
          orderBy: { uploadedAt: 'desc' }
        },
        _count: {
          select: { files: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Create example record if table is empty
    if (applications.length === 0) {
      const example = await prisma.application.create({
        data: {
          data: {
            companyName: "Example Company",
            positionTitle: "Software Developer",
            jobUrl: "https://example.com/job",
            applicationDate: new Date().toISOString().split('T')[0],
            status: "APPLIED",
            jobDescription: "This is an example application record. Click 'New' to add your first real application.",
            qualifications: "Bachelor's degree, 2+ years experience in software development.",
            notes: "This is example data - click 'New' to add your first real application"
          }
        },
        include: {
          files: {
            orderBy: { uploadedAt: 'desc' }
          },
          _count: { select: { files: true } }
        }
      });
      applications = [example];
    }

    res.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    console.log("Database not available, returning mock data");
    
    // Return mock data when database is not available
    const mockApplications = [
      {
        id: "mock-1",
        data: {
          companyName: "Tech Corp",
          positionTitle: "Software Engineer",
          jobUrl: "https://example.com/job1",
          applicationDate: "2024-01-15",
          status: "APPLIED",
          notes: "Applied through company website",
          location: "San Francisco, CA",
          salary: "$120,000 - $150,000",
          jobType: "Full-time",
          jobDescription: "We are looking for a talented software engineer to join our team...",
          qualifications: "Bachelor's degree in Computer Science, 3+ years experience..."
        },
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        _count: { files: 2 }
      },
      {
        id: "mock-2",
        data: {
          companyName: "StartupXYZ",
          positionTitle: "Frontend Developer",
          jobUrl: "https://example.com/job2",
          applicationDate: "2024-01-20",
          status: "INTERVIEW_SCHEDULED",
          notes: "Phone interview scheduled for next week",
          location: "Remote",
          salary: "$90,000 - $110,000",
          jobType: "Full-time",
          jobDescription: "Join our fast-growing startup as a frontend developer...",
          qualifications: "React, TypeScript, 2+ years experience..."
        },
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
        _count: { files: 1 }
      },
      {
        id: "mock-3",
        data: {
          companyName: "BigTech Inc",
          positionTitle: "Senior Developer",
          jobUrl: "https://example.com/job3",
          applicationDate: "2024-01-25",
          status: "APPLIED",
          notes: "Applied through LinkedIn",
          location: "Seattle, WA",
          salary: "$140,000 - $180,000",
          jobType: "Full-time",
          jobDescription: "We're seeking a senior developer to lead our core platform team...",
          qualifications: "5+ years experience, leadership skills, full-stack development..."
        },
        createdAt: new Date("2024-01-25"),
        updatedAt: new Date("2024-01-25"),
        _count: { files: 3 }
      }
    ];
    
    res.json(mockApplications);
  }
}

export async function getApplicationById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        files: {
          orderBy: { uploadedAt: 'desc' }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ error: "Failed to fetch application" });
  }
}

export async function createApplication(req: Request, res: Response) {
  try {
    const { data } = req.body;
    const files = req.files as Express.Multer.File[];
    
    console.log("CreateApplication - Files received:", files ? files.length : 0);
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        console.log(`File ${index}:`, {
          originalname: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype
        });
      });
    }
    
    // Create the application first
    const application = await prisma.application.create({
      data: {
        data: data || {}
      },
      include: {
        files: {
          orderBy: { uploadedAt: 'desc' }
        },
        _count: {
          select: { files: true }
        }
      }
    });
    
    // If files were uploaded, save them to the database
    if (files && files.length > 0) {
      const fileRecords = await Promise.all(
        files.map(file => {
          console.log("Creating file record for:", file.originalname, "at path:", file.path);
          return prisma.applicationFile.create({
            data: {
              applicationId: application.id,
              fileName: file.originalname,
              filePath: `uploads/${file.filename}`
            }
          });
        })
      );
      
      // Update the application response to include the files
      application.files = fileRecords;
      application._count.files = fileRecords.length;
    }
    
    res.status(201).json(application);
  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({ error: "Failed to create application" });
  }
}

export async function updateApplication(req: Request, res: Response) {
  console.log("🔥🔥🔥 UPDATE APPLICATION FUNCTION CALLED 🔥🔥🔥");
  console.log("🔥🔥🔥 THIS IS THE UPDATED VERSION 🔥🔥🔥");
  console.log("🔥🔥🔥 TIMESTAMP: " + new Date().toISOString() + " 🔥🔥🔥");
  try {
    console.log("=== UPDATE APPLICATION CALLED ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Headers:", req.headers);
    
    const { id } = req.params;
    const requestBody = req.body;
    
    console.log("UpdateApplication - Received request body:", typeof requestBody, JSON.stringify(requestBody, null, 2));
    console.log("Request body keys:", requestBody ? Object.keys(requestBody) : 'null');
    console.log("Has 'data' property:", requestBody && 'data' in requestBody);
    
    // STRICT VALIDATION: Accept only top-level JSON object, NOT { data: {...} }
    let updateData: Record<string, any>;
    
    // Check if request has nested 'data' property (old format)
    if (requestBody && typeof requestBody === 'object' && requestBody !== null && 'data' in requestBody) {
      console.error("REJECTED: Old format with nested 'data' property detected");
      console.error("Request body keys:", Object.keys(requestBody));
      console.error("Request body.data:", requestBody.data);
      return res.status(400).json({ 
        error: "Invalid request format. Send data directly as JSON object, not nested in 'data' property.",
        expected: "{ companyName: '...', positionTitle: '...', ... }",
        received: "{ data: { companyName: '...', ... } }",
        debug: {
          requestBodyKeys: Object.keys(requestBody),
          hasDataProperty: 'data' in requestBody,
          dataValue: requestBody.data
        }
      });
    }
    
    // Additional validation: Check if requestBody is exactly { data: {...} }
    if (requestBody && typeof requestBody === 'object' && requestBody !== null) {
      const keys = Object.keys(requestBody);
      if (keys.length === 1 && keys[0] === 'data') {
        console.error("REJECTED: Detected { data: {...} } format");
        return res.status(400).json({ 
          error: "Invalid request format. Send data directly as JSON object, not nested in 'data' property.",
          expected: "{ companyName: '...', positionTitle: '...', ... }",
          received: "{ data: { companyName: '...', ... } }"
        });
      }
    }
    
    // Accept direct JSON object
    if (typeof requestBody === 'object' && requestBody !== null) {
      updateData = requestBody;
      console.log("Using requestBody directly as updateData");
    } else if (typeof requestBody === 'string') {
      try {
        updateData = JSON.parse(requestBody);
        console.log("Parsed JSON string to updateData");
      } catch (e) {
        console.error("Failed to parse JSON string:", e);
        return res.status(400).json({ error: "Invalid JSON format" });
      }
    } else {
      return res.status(400).json({ 
        error: "Request body must be a JSON object",
        received: typeof requestBody
      });
    }
    
    console.log("Final updateData:", JSON.stringify(updateData, null, 2));
    
    // Get current application to merge data
    const currentApplication = await prisma.application.findUnique({
      where: { id }
    });
    
    if (!currentApplication) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    // Merge new data with existing data
    const existingData = currentApplication.data as Record<string, any> || {};
    
    // CRITICAL FIX: Prevent character array bug by ensuring updateData is an object
    if (typeof updateData === 'string') {
      console.error("CRITICAL ERROR: updateData is a string, this will cause character array bug!");
      return res.status(400).json({ 
        error: "Data must be an object, not a string",
        received: typeof updateData,
        value: updateData
      });
    }
    
    if (typeof updateData !== 'object' || updateData === null) {
      console.error("CRITICAL ERROR: updateData is not an object!");
      return res.status(400).json({ 
        error: "Data must be an object",
        received: typeof updateData
      });
    }
    
    // CRITICAL FIX: Clean existing data to remove character array bug
    const cleanExistingData: Record<string, any> = {};
    if (existingData && typeof existingData === 'object') {
      for (const [key, value] of Object.entries(existingData)) {
        // Skip numeric keys (character array bug indicators)
        if (!/^\d+$/.test(key)) {
          cleanExistingData[key] = value;
        }
      }
    }
    
    console.log("Clean existing data:", JSON.stringify(cleanExistingData, null, 2));
    
    const mergedData = {
      ...cleanExistingData,
      ...updateData
    };
    
    console.log("Merged data:", JSON.stringify(mergedData, null, 2));
    
    const application = await prisma.application.update({
      where: { id },
      data: {
        data: mergedData
      },
      include: {
        files: {
          orderBy: { uploadedAt: 'desc' }
        },
        _count: {
          select: { files: true }
        }
      }
    });
    
    res.json(application);
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({ error: "Failed to update application" });
  }
}

export async function deleteApplication(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    await prisma.application.update({
      where: { id },
      data: { 
        isDeleted: true,
        deletedAt: new Date()
      }
    });
    
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({ error: "Failed to delete application" });
  }
}

export async function restoreApplication(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    await prisma.application.update({
      where: { id },
      data: { 
        isDeleted: false,
        deletedAt: null
      }
    });
    
    res.json({ message: "Application restored successfully" });
  } catch (error) {
    console.error("Restore application error:", error);
    res.status(500).json({ error: "Failed to restore application" });
  }
}