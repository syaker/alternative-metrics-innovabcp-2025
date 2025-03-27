/*
  Warnings:

  - Added the required column `category` to the `credit_evaluations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `recommendations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit_evaluations" ADD COLUMN     "category" "CreditEvaluationCategory" NOT NULL;

-- AlterTable
ALTER TABLE "recommendations" ADD COLUMN     "category" "CreditEvaluationCategory" NOT NULL;
