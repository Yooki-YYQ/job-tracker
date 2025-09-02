import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// health check
app.get("/health", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV, db: "postgres" });
});

// Demo: Create a user (for demonstration only: the password will be encrypted later)
app.post("/api/users", async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) return res.status(400).json({ message: "email & password required" });

    const user = await prisma.user.create({ data: { email, password } });
    res.status(201).json(user);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: e?.message || "internal error" });
  }
});

// Demo: Query all users
app.get("/api/users", async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  res.json(users);
});

app.listen(PORT, () => {
  console.log(` API running on http://localhost:${PORT}`);
});
