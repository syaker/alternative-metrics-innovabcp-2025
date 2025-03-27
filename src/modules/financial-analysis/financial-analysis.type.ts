import { CreditEvaluationStatus, CreditType, RiskLevel } from '@prisma/client';

export interface EvaluationAnalysisReport {
  userId: number;
  creditType: CreditType;
  scoreByCategory: {
    bankTransactions: number;
    billPayment: number;
    residenceAge: number;
    socialMedia: number;
    stabilityEmployment: number;
  };
  transactionsReport: {
    totalResidenceMonths: number;
    totalSalaryAmount: number;
    totalSalaryPayments: number;
    totalTransactionExpensesAmount: number;
    totalTransactionIncomingAmount: number;
    avgMonthlyIncome: number;
    avgMonthlyExpense: number;
    totalTransactions: number;
    status: CreditEvaluationStatus;
    score: number;
    riskLevel: RiskLevel;
    debtRatio: number;
    reliabilityScore: number;
  };
}
