-- CreateEnum
CREATE TYPE "TransactionCurrency" AS ENUM ('PEN', 'USD');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "TransactionPaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'TRANSFER');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "CreditEvaluationStatus" AS ENUM ('APPROVED', 'REJECTED', 'PENDING');

-- CreateEnum
CREATE TYPE "CreditEvaluationCategory" AS ENUM ('STABILITY_EMPLOYMENT', 'SOCIAL_MEDIA', 'RESIDENCE_AGE', 'BILL_PAYMENT', 'BANK_TRANSACTIONS');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "has_family" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_credit_evaluations" (
    "id" SERIAL NOT NULL,
    "recommendation_id" INTEGER NOT NULL,
    "credit_evaluation_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "recommendation_credit_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_evaluations" (
    "id" SERIAL NOT NULL,
    "evaluationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" DOUBLE PRECISION NOT NULL,
    "risk_level" "RiskLevel" NOT NULL,
    "status" "CreditEvaluationStatus" NOT NULL,
    "total_transactions" INTEGER NOT NULL,
    "total_income" DECIMAL(65,30) NOT NULL,
    "total_expenses" DECIMAL(65,30) NOT NULL,
    "avg_monthly_income" DECIMAL(65,30) NOT NULL,
    "avg_monthly_expense" DECIMAL(65,30) NOT NULL,
    "debt_ratio" DOUBLE PRECISION NOT NULL,
    "reliability_score" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "credit_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "amount" TEXT NOT NULL,
    "currency" "TransactionCurrency" NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "category" TEXT NOT NULL,
    "merchant_name" TEXT NOT NULL,
    "payment_method" "TransactionPaymentMethod" NOT NULL,
    "source" TEXT NOT NULL,
    "location" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "credit_evaluations_user_id_evaluationDate_idx" ON "credit_evaluations"("user_id", "evaluationDate");

-- AddForeignKey
ALTER TABLE "recommendation_credit_evaluations" ADD CONSTRAINT "recommendation_credit_evaluations_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_credit_evaluations" ADD CONSTRAINT "recommendation_credit_evaluations_credit_evaluation_id_fkey" FOREIGN KEY ("credit_evaluation_id") REFERENCES "credit_evaluations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_evaluations" ADD CONSTRAINT "credit_evaluations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
