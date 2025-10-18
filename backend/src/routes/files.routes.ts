// backend/src/routes/files.routes.ts
import { Router } from "express";
import {
  downloadFile,
  deleteApplicationFile
} from "../controllers/files.controller";

const router = Router();

// File download and delete routes (mounted at /api/files)
router.get("/:fileId/download", downloadFile);
router.delete("/:fileId", deleteApplicationFile);

export default router;
