// import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient();
// src/config/prisma.ts
//Export Prisma instances uniformly (avoid duplicate connections during hot reload)
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
