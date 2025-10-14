"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplications = getApplications;
exports.getApplicationById = getApplicationById;
exports.createApplication = createApplication;
exports.updateApplication = updateApplication;
exports.deleteApplication = deleteApplication;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getApplications(req, res) {
    try {
        const applications = await prisma.application.findMany({
            include: {
                _count: {
                    select: { files: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(applications);
    }
    catch (error) {
        console.error("Get applications error:", error);
        console.log("Database not available, returning mock data");
        // Return mock data when database is not available
        const mockApplications = [
            {
                id: "mock-1",
                companyName: "Tech Corp",
                positionTitle: "Software Engineer",
                jobUrl: "https://example.com/job1",
                applicationDate: new Date("2024-01-15"),
                status: "APPLIED",
                notes: "Applied through company website",
                location: "San Francisco, CA",
                salary: "$120,000 - $150,000",
                jobType: "Full-time",
                jobDescription: "We are looking for a talented software engineer to join our team...",
                qualifications: "Bachelor's degree in Computer Science, 3+ years experience...",
                confidence: 0.85,
                createdAt: new Date("2024-01-15"),
                updatedAt: new Date("2024-01-15"),
                _count: { files: 2 }
            },
            {
                id: "mock-2",
                companyName: "StartupXYZ",
                positionTitle: "Frontend Developer",
                jobUrl: "https://example.com/job2",
                applicationDate: new Date("2024-01-20"),
                status: "INTERVIEW_SCHEDULED",
                notes: "Phone interview scheduled for next week",
                location: "Remote",
                salary: "$90,000 - $110,000",
                jobType: "Full-time",
                jobDescription: "Join our fast-growing startup as a frontend developer...",
                qualifications: "React, TypeScript, 2+ years experience...",
                confidence: 0.92,
                createdAt: new Date("2024-01-20"),
                updatedAt: new Date("2024-01-20"),
                _count: { files: 1 }
            },
            {
                id: "mock-3",
                companyName: "BigTech Inc",
                positionTitle: "Senior Developer",
                jobUrl: "https://example.com/job3",
                applicationDate: new Date("2024-01-25"),
                status: "APPLIED",
                notes: "Applied through LinkedIn",
                location: "Seattle, WA",
                salary: "$140,000 - $180,000",
                jobType: "Full-time",
                jobDescription: "We're seeking a senior developer to lead our core platform team...",
                qualifications: "5+ years experience, leadership skills, full-stack development...",
                confidence: 0.78,
                createdAt: new Date("2024-01-25"),
                updatedAt: new Date("2024-01-25"),
                _count: { files: 3 }
            }
        ];
        res.json(mockApplications);
    }
}
async function getApplicationById(req, res) {
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
    }
    catch (error) {
        console.error("Get application error:", error);
        res.status(500).json({ error: "Failed to fetch application" });
    }
}
async function createApplication(req, res) {
    try {
        const { companyName, positionTitle, jobUrl, applicationDate, status, notes, location, salary, jobType, jobDescription, qualifications, confidence } = req.body;
        const application = await prisma.application.create({
            data: {
                companyName,
                positionTitle,
                jobUrl: jobUrl || null,
                applicationDate: applicationDate ? new Date(applicationDate) : null,
                status: status,
                notes: notes || null,
                location: location || null,
                salary: salary || null,
                jobType: jobType || null,
                jobDescription: jobDescription || null,
                qualifications: qualifications || null,
                confidence: confidence || null
            },
            include: {
                _count: {
                    select: { files: true }
                }
            }
        });
        res.status(201).json(application);
    }
    catch (error) {
        console.error("Create application error:", error);
        res.status(500).json({ error: "Failed to create application" });
    }
}
async function updateApplication(req, res) {
    try {
        const { id } = req.params;
        const { companyName, positionTitle, jobUrl, applicationDate, status, notes, location, salary, jobType, jobDescription, qualifications, confidence } = req.body;
        const application = await prisma.application.update({
            where: { id },
            data: {
                companyName,
                positionTitle,
                jobUrl: jobUrl ?? null,
                applicationDate: applicationDate ? new Date(applicationDate) : null,
                status: status,
                notes: notes ?? null,
                location: location ?? null,
                salary: salary ?? null,
                jobType: jobType ?? null,
                jobDescription: jobDescription ?? null,
                qualifications: qualifications ?? null,
                confidence: confidence ?? null
            },
            include: {
                _count: {
                    select: { files: true }
                }
            }
        });
        res.json(application);
    }
    catch (error) {
        console.error("Update application error:", error);
        res.status(500).json({ error: "Failed to update application" });
    }
}
async function deleteApplication(req, res) {
    try {
        const { id } = req.params;
        await prisma.application.delete({
            where: { id }
        });
        res.json({ message: "Application deleted successfully" });
    }
    catch (error) {
        console.error("Delete application error:", error);
        res.status(500).json({ error: "Failed to delete application" });
    }
}
//# sourceMappingURL=applications.controller.js.map