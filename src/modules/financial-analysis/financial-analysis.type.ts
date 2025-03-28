import {
  CreditEvaluationStatus,
  CreditType,
  ExpenseType,
  RiskLevel,
  TransactionCurrency,
  TransactionPaymentMethod,
  TransactionType,
} from '@prisma/client';

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

export type TransactionParams = {
  amount: number;
  currency: TransactionCurrency;
  transactionType: TransactionType;
  category: ExpenseType;
  merchantName: string;
  paymentMethod: TransactionPaymentMethod;
  source: string;
  location: {};
  metadata: {};
  invoiceNumber: string;
  userId: number;
};
