"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const applications_routes_1 = __importDefault(require("./routes/applications.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check
app.get("/health", (_req, res) => {
    res.json({ ok: true, env: process.env.NODE_ENV, db: "postgres" });
});
//  Routing
app.use("/api/applications", applications_routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map