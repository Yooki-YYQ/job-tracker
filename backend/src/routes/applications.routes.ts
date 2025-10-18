// backend/src/routes/applications.routes.ts
import { Router } from "express";
import {
  createApplication,
  updateApplication,
  getApplications,
  getApplicationById,
  deleteApplication,
  restoreApplication
} from "../controllers/applications.controller";
import {
  upload,
  testFilesEndpoint,
  uploadApplicationFiles,
  getApplicationFiles
} from "../controllers/files.controller";

const router = Router();

// Test endpoint for files functionality
router.get("/files/test", testFilesEndpoint);

// Existing application routes
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.post("/", upload.array("files", 5), createApplication);
router.put("/:id", updateApplication);
router.patch("/:id", updateApplication);
router.delete("/:id", deleteApplication);
router.post("/:id/restore", restoreApplication);

// File management routes
router.post("/:applicationId/files", upload.array("files", 5), uploadApplicationFiles);
router.get("/:applicationId/files", getApplicationFiles);

export default router;