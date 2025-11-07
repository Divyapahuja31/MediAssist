/*
  Warnings:

  - You are about to drop the column `timestamp` on the `adherence_logs` table. All the data in the column will be lost.
  - You are about to drop the column `storagePath` on the `prescriptions` table. All the data in the column will be lost.
  - Added the required column `storageKey` to the `prescriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "adherence_logs" DROP COLUMN "timestamp",
ADD COLUMN     "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "medication_schedules" ADD COLUMN     "daysOfWeek" INTEGER[];

-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "storagePath",
ADD COLUMN     "mimetype" TEXT,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "storageKey" TEXT NOT NULL;
