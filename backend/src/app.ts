import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import applicationsRouter from "./routes/applications.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV, db: "postgres" });
});

//  Routing
app.use("/api/applications", applicationsRouter);

export default app;
