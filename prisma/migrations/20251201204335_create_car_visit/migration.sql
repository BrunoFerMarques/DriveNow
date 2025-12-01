/*
  Warnings:

  - You are about to drop the column `notes` on the `CarVisit` table. All the data in the column will be lost.
  - You are about to drop the column `visitDate` on the `CarVisit` table. All the data in the column will be lost.
  - You are about to drop the column `visitTime` on the `CarVisit` table. All the data in the column will be lost.
  - Added the required column `date` to the `CarVisit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarVisit" DROP COLUMN "notes",
DROP COLUMN "visitDate",
DROP COLUMN "visitTime",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
