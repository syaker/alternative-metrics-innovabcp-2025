/*
  Warnings:

  - You are about to drop the column `category` on the `users` table. All the data in the column will be lost.
  - Added the required column `document` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_type` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('DNI', 'PASSPORT', 'CE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE', 'OTHER');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "category",
ADD COLUMN     "document" TEXT NOT NULL,
ADD COLUMN     "document_type" "DocumentType" NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "has_family" SET DEFAULT false;
