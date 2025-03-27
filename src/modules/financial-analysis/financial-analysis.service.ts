import { Injectable, Logger } from '@nestjs/common';
import {
  CreditEvaluationCategory,
  CreditEvaluationStatus,
  CreditType,
  ExpenseType,
  Gender,
  RiskLevel,
  TransactionType,
  User,
} from '@prisma/client';
import { DateTime } from 'luxon';
import { YEAR_IN_MILLISECONDS } from '../../constants/numbers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-new-profile.dto';
import { EvaluationAnalysisReport } from './financial-analysis.type';
import {
  HIGH_RISK_THRESHOLD,
  MEDIUM_RISK_THRESHOLD,
  MIN_EXPENSES_BY_PAYMENT_TYPE,
  MIN_TRANSACTIONS_SINCE_LAST_EVALUATION,
  MORTGAGE_MIN_SCORE_BY_CREDIT_TYPE_THRESHOLD,
  PERSONAL_MIN_SCORE_BY_CREDIT_TYPE_THRESHOLD,
  RE_COMPUTE_ELIGIBILITY_PERIOD_IN_MS,
  RECEIPT_WEIGHTS,
  SCORE_BY_CATEGORY,
  TRANSACTION_EVALUATION_PERIOD_MONTHS,
  VEHICLE_MIN_SCORE_BY_CREDIT_TYPE_THRESHOLD,
} from './rules/scoring-rules';

@Injectable()
export class FinancialAnalysisService {
  private logger = new Logger(FinancialAnalysisService.name);

  constructor(private prismaService: PrismaService) {}

  async calculateScoreByUser(userId: number, creditType: CreditType) {
    // 1. Get user to calculate score
    const user = await this.prismaService.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });

    // 2. Check if the user has a credit evaluation
    const lastCreditEvaluation = await this.prismaService.creditEvaluation.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        evaluationDate: 'desc',
      },
    });

    // 3. If has no evaluations proceed to calculate
    if (!lastCreditEvaluation) {
      this.logger.log(`User with id ${user.id} has no evaluations, proceeding to calculate...`);
    }

    // 4. If their last evaluation was done more than the allowed period ago
    if (lastCreditEvaluation && this.metWithTimeToReevaluate(lastCreditEvaluation.evaluationDate)) {
      const diffInDays = DateTime.fromISO(String(lastCreditEvaluation.evaluationDate)).diff(
        DateTime.fromISO(this.allowedTimeToReevaluateStartDate().toISOString()),
        'days',
      ).days;

      // Return a message indicating that it's too early to reevaluate, try in X days
      return { reason: `Please review your evaluation in ${diffInDays} more` };
    }

    // 6. Proceed to evaluate
    const report = await this.evaluateCreditByUser(user, creditType);

    if (!report) {
      return { reason: 'Too few transactions until now' };
    }

    const {
      score,
      reliabilityScore,
      riskLevel,
      status,
      avgMonthlyExpense,
      avgMonthlyIncome,
      totalTransactionExpensesAmount,
      totalTransactionIncomingAmount,
      totalTransactions,
      debtRatio,
    } = report.transactionsReport;

    await this.prismaService.creditEvaluation.create({
      data: {
        creditType: CreditType.MORTGAGE,
        riskLevel,
        score,
        status,
        avgMonthlyExpense,
        avgMonthlyIncome,
        totalTransactions,
        totalExpenses: totalTransactionExpensesAmount,
        totalIncome: totalTransactionIncomingAmount,
        debtRatio,
        reliabilityScore,
        userId: report.userId,
      },
    });

    return report;
  }

  allowedTimeToReevaluateStartDate() {
    return new Date(new Date().getTime() - RE_COMPUTE_ELIGIBILITY_PERIOD_IN_MS);
  }

  metWithTimeToReevaluate(evaluationDate: Date | string) {
    return (
      new Date(evaluationDate).getTime() < this.allowedTimeToReevaluateStartDate().getTime() ||
      false
    );
  }

  async evaluateCreditByUser(
    user: User,
    creditType: CreditType,
  ): Promise<EvaluationAnalysisReport | null> {
    // Obtain all transactions made from 3 months ago
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        userId: user.id,
        createdAt: {
          // We consider 3 months of transactions to consider it valid
          gte: new Date(new Date().getTime() - TRANSACTION_EVALUATION_PERIOD_MONTHS),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Verify if met with min transactions
    const hasMinimumTransactionsToProceed =
      transactions.length > MIN_TRANSACTIONS_SINCE_LAST_EVALUATION;

    if (!hasMinimumTransactionsToProceed) {
      return null;
    }

    // Sum receipts by category
    let receiptsByCategory = {
      rent: 0,
      water: 0,
      electricity: 0,
      telephony: 0,
      internet: 0,
      college: 0,
      certifications: 0,
      university: 0,
      onlineShopping: 0,
    };

    let totalTransactionIncomingAmount = 0;
    let totalTransactionExpensesAmount = 0;
    let totalSalaryPayments = 0;
    let totalSalaryAmount = 0;
    let totalResidenceMonths = 0;

    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];

      if (transaction.transactionType === TransactionType.EXPENSE) {
        totalTransactionExpensesAmount += transaction.amount;
      }

      if (transaction.transactionType === TransactionType.INCOME) {
        totalTransactionIncomingAmount += transaction.amount;

        switch (transaction.category) {
          case ExpenseType.SALARY:
            totalSalaryAmount += transaction.amount;
            totalSalaryPayments += 1;
            break;
          case ExpenseType.RENT:
            receiptsByCategory.rent += 1;

            // We're going to assume that each rent contracts are by 1 year
            totalResidenceMonths += 1;
            break;
          case ExpenseType.WATER:
            receiptsByCategory.water += 1;
            break;
          case ExpenseType.ELECTRICITY:
            receiptsByCategory.electricity += 1;
            break;
          case ExpenseType.TELEPHONY:
            receiptsByCategory.telephony += 1;
            break;
          case ExpenseType.INTERNET:
            receiptsByCategory.internet += 1;
            break;
          case ExpenseType.COLLEGE:
            receiptsByCategory.college += 1;
            break;
          case ExpenseType.CERTIFICATIONS:
            receiptsByCategory.certifications += 1;
            break;
          case ExpenseType.UNIVERSITY:
            receiptsByCategory.university += 1;
            break;
          case ExpenseType.ONLINE_SHOPPING:
            receiptsByCategory.onlineShopping += 1;
            break;
        }
      }
    }

    // Total sum of weights (to normalize the score)
    const totalWeights = Object.values(RECEIPT_WEIGHTS).reduce((sum, weight) => sum + weight, 0);

    let weightedScoreSum = 0;

    // Calculate weighted score for each category
    for (const category in MIN_EXPENSES_BY_PAYMENT_TYPE) {
      const minRequired = MIN_EXPENSES_BY_PAYMENT_TYPE[category];
      const actualCount = receiptsByCategory[category] || 0;
      const weight = RECEIPT_WEIGHTS[category] || 1;

      // Calculate the ratio: if actual is less than minimum, ratio will be < 1, reducing the score
      let ratio = actualCount / minRequired;
      if (ratio > 1) {
        // Cap the ratio to 1 if it exceeds the minimum
        ratio = 1;
      }

      // Weighted score for this category
      const categoryScore = ratio * weight;
      weightedScoreSum += categoryScore;
    }

    // Normalize the total score (value between 0 and 1)
    const normalizedBillPaymentScore = weightedScoreSum / totalWeights;

    // Final score for the BILL_PAYMENT category according to the percentage defined in SCORE_BY_CATEGORY
    const billPaymentScore =
      normalizedBillPaymentScore * SCORE_BY_CATEGORY[CreditEvaluationCategory.BILL_PAYMENT];

    // We get the first one since we're ordering by 'desc'
    const lastTransaction = transactions.slice(-1)[0];

    // -- Score by category --
    const residenceAgeScore = this.calculateResidenceAgeScore(lastTransaction.createdAt);
    const employmentStabilityScore = this.calculateEmploymentStabilityScore(
      lastTransaction.createdAt,
    );
    const bankTransactionsScore = transactions.length * SCORE_BY_CATEGORY.BANK_TRANSACTIONS;
    const reliabilityScore =
      (billPaymentScore + residenceAgeScore + employmentStabilityScore + bankTransactionsScore) / 4;

    // -- Historical Report --
    // Based on how close are the scores by category to ideal
    const score =
      (billPaymentScore + residenceAgeScore + employmentStabilityScore + bankTransactionsScore) *
      100;
    const avgMonthlyIncome = totalTransactionIncomingAmount / TRANSACTION_EVALUATION_PERIOD_MONTHS;
    const avgMonthlyExpense = totalTransactionExpensesAmount / TRANSACTION_EVALUATION_PERIOD_MONTHS;
    const riskLevel = this.calculateRiskLevel(score);
    const debtRatio =
      totalTransactionIncomingAmount > 0
        ? totalTransactionExpensesAmount / totalTransactionIncomingAmount
        : 1;
    // Depends on the type of credit
    const status = this.metScoreWithCreditType(creditType, score)
      ? CreditEvaluationStatus.APPROVED
      : CreditEvaluationStatus.REJECTED;

    const totalTransactions = transactions.length;

    // TODO: Evaluate social media
    // TODO: Evaluate from 0 to 1000 based on how much close are values to ideal
    return {
      userId: user.id,
      creditType,
      scoreByCategory: {
        bankTransactions: bankTransactionsScore,
        billPayment: billPaymentScore,
        residenceAge: residenceAgeScore,
        socialMedia: 0,
        stabilityEmployment: employmentStabilityScore,
      },
      transactionsReport: {
        totalResidenceMonths,
        totalSalaryAmount,
        totalSalaryPayments,
        totalTransactionExpensesAmount,
        totalTransactionIncomingAmount,
        avgMonthlyIncome,
        avgMonthlyExpense,
        totalTransactions,
        status,
        score,
        riskLevel,
        debtRatio,
        reliabilityScore,
      },
    };
  }

  calculateRiskLevel(score: number) {
    let riskLevel: RiskLevel;

    if (score < HIGH_RISK_THRESHOLD) {
      riskLevel = RiskLevel.HIGH;
    } else if (score < MEDIUM_RISK_THRESHOLD) {
      riskLevel = RiskLevel.MEDIUM;
    } else {
      riskLevel = RiskLevel.LOW;
    }

    return riskLevel;
  }

  metScoreWithCreditType(creditType: CreditType, score: number) {
    switch (creditType) {
      case CreditType.MORTGAGE:
        return score > MORTGAGE_MIN_SCORE_BY_CREDIT_TYPE_THRESHOLD || false;

      case CreditType.PERSONAL:
        return score > PERSONAL_MIN_SCORE_BY_CREDIT_TYPE_THRESHOLD || false;

      case CreditType.VEHICLE:
        return score > VEHICLE_MIN_SCORE_BY_CREDIT_TYPE_THRESHOLD || false;

      default:
        return false;
    }
  }

  calculateResidenceAgeScore(firstReceiptDate: Date): number {
    // Calculate the difference in years
    const residenceYears = Math.floor(
      (Date.now() - new Date(firstReceiptDate).getTime()) / YEAR_IN_MILLISECONDS,
    );

    // Normalize the score (assuming max score is achieved at 5 years or more)
    const normalizedScore = Math.min(residenceYears / 5, 1);

    // Apply category weight
    return normalizedScore * SCORE_BY_CATEGORY.RESIDENCE_AGE;
  }

  calculateEmploymentStabilityScore(firstSalaryDate: Date): number {
    // Calculate total months with salary payments
    const currentDate = new Date();
    const totalMonths = Math.floor(
      (currentDate.getTime() - firstSalaryDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );

    // Convert to years
    const employmentYears = totalMonths / 12;

    // Normalize the score (assuming max score is achieved at 4 years or more)
    const normalizedScore = Math.min(employmentYears / 4, 1);

    // Apply category weight
    return normalizedScore * SCORE_BY_CATEGORY.STABILITY_EMPLOYMENT;
  }

  async createNewProfile(body: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        email: body.email,
        name: body.name,
        phone: body.phone,
        document: body.document,
        documentType: body.documentType,
        gender: Gender.FEMALE, // Hardcoded for now
      },
    });
  }

  async getRecommendationsForUser() {}

  async uploadFilesForProcessing() {}
}
