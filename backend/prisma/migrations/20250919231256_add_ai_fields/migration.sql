-- AlterTable
ALTER TABLE "public"."applications" ADD COLUMN     "confidence" DOUBLE PRECISION,
ADD COLUMN     "jobDescription" TEXT,
ADD COLUMN     "jobType" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "qualifications" TEXT,
ADD COLUMN     "salary" TEXT;
