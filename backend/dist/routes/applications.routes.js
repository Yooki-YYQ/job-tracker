"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/applications.routes.ts
const express_1 = require("express");
const applications_controller_1 = require("../controllers/applications.controller");
const files_controller_1 = require("../controllers/files.controller");
const router = (0, express_1.Router)();
// Test endpoint for files functionality
router.get("/files/test", files_controller_1.testFilesEndpoint);
// Existing application routes
router.get("/", applications_controller_1.getApplications);
router.get("/:id", applications_controller_1.getApplicationById);
router.post("/", applications_controller_1.createApplication);
router.put("/:id", applications_controller_1.updateApplication);
router.patch("/:id", applications_controller_1.updateApplication);
router.delete("/:id", applications_controller_1.deleteApplication);
// File management routes
router.post("/:applicationId/files", files_controller_1.upload.array("files", 5), files_controller_1.uploadApplicationFiles);
router.get("/:applicationId/files", files_controller_1.getApplicationFiles);
router.get("/files/:fileId/download", files_controller_1.downloadFile);
router.delete("/files/:fileId", files_controller_1.deleteApplicationFile);
exports.default = router;
//# sourceMappingURL=applications.routes.js.map