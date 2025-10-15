// backend/src/controllers/applications.controller.ts
import { Request, Response } from "express";
import { PrismaClient, ApplicationStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function getApplications(req: Request, res: Response) {
  try {
    let applications = await prisma.application.findMany({
      where: { isDeleted: false }, // Add soft delete filter
      include: {
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
    
    const application = await prisma.application.create({
      data: {
        data: data || {}
      },
      include: {
        _count: {
          select: { files: true }
        }
      }
    });
    
    res.status(201).json(application);
  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({ error: "Failed to create application" });
  }
}

export async function updateApplication(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { data } = req.body;
    
    // Get current application to merge data
    const currentApplication = await prisma.application.findUnique({
      where: { id }
    });
    
    if (!currentApplication) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    // Merge new data with existing data
    const existingData = currentApplication.data as Record<string, any> || {};
    const mergedData = {
      ...existingData,
      ...data
    };
    
    const application = await prisma.application.update({
      where: { id },
      data: {
        data: mergedData
      },
      include: {
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