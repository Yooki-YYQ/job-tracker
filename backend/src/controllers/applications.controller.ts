import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { ApplicationStatus } from "@prisma/client";

// 创建
export async function createApplication(req: Request, res: Response) {
  try {
    const { companyName, positionTitle, jobUrl, applicationDate, status, notes } = req.body;

    if (!companyName || !positionTitle) {
      return res.status(400).json({ message: "companyName & positionTitle are required" });
    }

    const app = await prisma.application.create({
      data: {
        companyName,
        positionTitle,
        jobUrl,
        applicationDate: applicationDate ? new Date(applicationDate) : undefined,
        status: status as ApplicationStatus | undefined,
        notes,
      },
    });
    res.status(201).json(app);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: e?.message || "internal error" });
  }
}

// 列表（支持筛选：关键词/状态/日期范围）
export async function listApplications(req: Request, res: Response) {
  try {
    const { q, status, dateFrom, dateTo } = req.query as {
      q?: string; status?: string; dateFrom?: string; dateTo?: string;
    };

    const where: any = {};
    if (q) {
      where.OR = [
        { companyName: { contains: q, mode: "insensitive" } },
        { positionTitle: { contains: q, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.applicationDate = {};
      if (dateFrom) where.applicationDate.gte = new Date(dateFrom);
      if (dateTo) where.applicationDate.lte = new Date(dateTo);
    }

    const items = await prisma.application.findMany({
      where,
      orderBy: { applicationDate: "desc" },
    });
    res.json(items);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: e?.message || "internal error" });
  }
}

// 详情
export async function getApplication(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const item = await prisma.application.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ message: "not found" });
    res.json(item);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: e?.message || "internal error" });
  }
}

// 更新
export async function updateApplication(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { companyName, positionTitle, jobUrl, applicationDate, status, notes } = req.body;

    const item = await prisma.application.update({
      where: { id },
      data: {
        companyName,
        positionTitle,
        jobUrl,
        applicationDate: applicationDate ? new Date(applicationDate) : undefined,
        status: status as ApplicationStatus | undefined,
        notes,
      },
    });
    res.json(item);
  } catch (e: any) {
    if (e.code === "P2025") return res.status(404).json({ message: "not found" });
    console.error(e);
    res.status(500).json({ message: e?.message || "internal error" });
  }
}

// 删除
export async function deleteApplication(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.application.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e: any) {
    if (e.code === "P2025") return res.status(404).json({ message: "not found" });
    console.error(e);
    res.status(500).json({ message: e?.message || "internal error" });
  }
}
