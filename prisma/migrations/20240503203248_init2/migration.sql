/*
  Warnings:

  - Added the required column `chargePerHour` to the `Tutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Tutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suburb` to the `Tutor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tutor` ADD COLUMN `chargePerHour` DOUBLE NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `suburb` VARCHAR(191) NOT NULL;
