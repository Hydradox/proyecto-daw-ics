/*
  Warnings:

  - Added the required column `fileName` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "fileName" TEXT NOT NULL;
