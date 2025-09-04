import { Router } from "express";
import {
  createApplication,
  listApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applications.controller";

const router = Router();

router.get("/", listApplications);
router.post("/", createApplication);
router.get("/:id", getApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
