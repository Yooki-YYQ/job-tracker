/*
  Warnings:

  - You are about to drop the column `fileSize` on the `application_files` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `application_files` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `application_files` table. All the data in the column will be lost.
  - You are about to drop the column `applicationDate` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `confidence` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `jobDescription` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `jobType` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `jobUrl` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `positionTitle` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `qualifications` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `applications` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."applications_applicationDate_idx";

-- DropIndex
DROP INDEX "public"."applications_status_idx";

-- AlterTable
ALTER TABLE "public"."application_files" DROP COLUMN "fileSize",
DROP COLUMN "mimeType",
DROP COLUMN "originalName";

-- AlterTable
ALTER TABLE "public"."applications" DROP COLUMN "applicationDate",
DROP COLUMN "companyName",
DROP COLUMN "confidence",
DROP COLUMN "jobDescription",
DROP COLUMN "jobType",
DROP COLUMN "jobUrl",
DROP COLUMN "location",
DROP COLUMN "notes",
DROP COLUMN "positionTitle",
DROP COLUMN "qualifications",
DROP COLUMN "salary",
DROP COLUMN "status",
ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}';
