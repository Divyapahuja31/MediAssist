/*
  Warnings:

  - You are about to drop the column `created_at` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `expo_push_token` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `medication_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `medication_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `last_sent` on the `medication_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `medication_id` on the `medication_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `next_run_at` on the `medication_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `medication_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `time_of_day` on the `medication_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `medication_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `medication_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `medications` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `medications` table. All the data in the column will be lost.
  - You are about to drop the column `medication_id` on the `prescriptions` table. All the data in the column will be lost.
  - You are about to drop the column `storage_path` on the `prescriptions` table. All the data in the column will be lost.
  - You are about to drop the column `uploaded_at` on the `prescriptions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[expoPushToken]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expoPushToken` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicationId` to the `medication_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `medication_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `medication_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `medications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storagePath` to the `prescriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_userId_fkey";

-- DropForeignKey
ALTER TABLE "medication_schedules" DROP CONSTRAINT "medication_schedules_medication_id_fkey";

-- DropForeignKey
ALTER TABLE "medication_schedules" DROP CONSTRAINT "medication_schedules_user_id_fkey";

-- DropForeignKey
ALTER TABLE "medications" DROP CONSTRAINT "medications_userId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_medication_id_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_userId_fkey";

-- DropIndex
DROP INDEX "devices_expo_push_token_key";

-- DropIndex
DROP INDEX "medication_schedules_medication_id_idx";

-- DropIndex
DROP INDEX "medication_schedules_next_run_at_idx";

-- DropIndex
DROP INDEX "medication_schedules_user_id_idx";

-- DropIndex
DROP INDEX "medications_name_idx";

-- DropIndex
DROP INDEX "profiles_userId_idx";

-- AlterTable
ALTER TABLE "devices" DROP COLUMN "created_at",
DROP COLUMN "expo_push_token",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expoPushToken" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "medication_schedules" DROP COLUMN "created_at",
DROP COLUMN "end_date",
DROP COLUMN "last_sent",
DROP COLUMN "medication_id",
DROP COLUMN "next_run_at",
DROP COLUMN "start_date",
DROP COLUMN "time_of_day",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" DATE,
ADD COLUMN     "lastSent" TIMESTAMP(3),
ADD COLUMN     "medicationId" TEXT NOT NULL,
ADD COLUMN     "nextRunAt" TIMESTAMP(3),
ADD COLUMN     "startDate" DATE,
ADD COLUMN     "timeOfDay" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "medications" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "stock" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "medication_id",
DROP COLUMN "storage_path",
DROP COLUMN "uploaded_at",
ADD COLUMN     "medicationId" TEXT,
ADD COLUMN     "storagePath" TEXT NOT NULL,
ADD COLUMN     "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PATIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adherence_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "medicationId" TEXT,
    "scheduleId" TEXT,
    "eventType" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adherence_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "adherence_logs_userId_idx" ON "adherence_logs"("userId");

-- CreateIndex
CREATE INDEX "adherence_logs_medicationId_idx" ON "adherence_logs"("medicationId");

-- CreateIndex
CREATE INDEX "adherence_logs_scheduleId_idx" ON "adherence_logs"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "devices_expoPushToken_key" ON "devices"("expoPushToken");

-- CreateIndex
CREATE INDEX "medication_schedules_userId_idx" ON "medication_schedules"("userId");

-- CreateIndex
CREATE INDEX "medication_schedules_medicationId_idx" ON "medication_schedules"("medicationId");

-- CreateIndex
CREATE INDEX "medication_schedules_nextRunAt_idx" ON "medication_schedules"("nextRunAt");

-- CreateIndex
CREATE INDEX "prescriptions_medicationId_idx" ON "prescriptions"("medicationId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_schedules" ADD CONSTRAINT "medication_schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_schedules" ADD CONSTRAINT "medication_schedules_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adherence_logs" ADD CONSTRAINT "adherence_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adherence_logs" ADD CONSTRAINT "adherence_logs_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adherence_logs" ADD CONSTRAINT "adherence_logs_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "medication_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
