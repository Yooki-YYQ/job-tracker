// backend/src/routes/applications.routes.ts
import { Router } from "express";
import {
  createApplication,
  updateApplication,
  getApplications,
  getApplicationById,
  deleteApplication
} from "../controllers/applications.controller";
import {
  upload,
  testFilesEndpoint,
  uploadApplicationFiles,
  getApplicationFiles,
  downloadFile,
  deleteApplicationFile
} from "../controllers/files.controller";

const router = Router();

// Test endpoint for files functionality
router.get("/files/test", testFilesEndpoint);

// Existing application routes
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.patch("/:id", updateApplication);
router.delete("/:id", deleteApplication);

// File management routes
router.post("/:applicationId/files", upload.array("files", 5), uploadApplicationFiles);
router.get("/:applicationId/files", getApplicationFiles);
router.get("/files/:fileId/download", downloadFile);
router.delete("/files/:fileId", deleteApplicationFile);

export default router;