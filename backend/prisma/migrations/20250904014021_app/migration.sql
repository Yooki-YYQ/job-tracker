-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('APPLIED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFER_RECEIVED', 'REJECTED', 'WITHDRAWN', 'ACCEPTED');

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "positionTitle" TEXT NOT NULL,
    "jobUrl" TEXT,
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "public"."Application"("status");

-- CreateIndex
CREATE INDEX "Application_applicationDate_idx" ON "public"."Application"("applicationDate");
