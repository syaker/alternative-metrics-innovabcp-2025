import { Injectable, Logger } from '@nestjs/common';
import {
  CreditEvaluationCategory,
  ExpenseType,
  Gender,
  TransactionType,
  User,
} from '@prisma/client';
import { DateTime } from 'luxon';
import { YEAR_IN_MILLISECONDS } from '../../constants/numbers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-new-profile.dto';
import {
  MIN_EXPENSES_BY_PAYMENT_TYPE,
  MIN_TRANSACTIONS_SINCE_LAST_EVALUATION,
  RE_COMPUTE_ELIGIBILITY_PERIOD_IN_MS,
  RECEIPT_WEIGHTS,
  SCORE_BY_CATEGORY,
  TRANSACTION_EVALUATION_PERIOD_MONTHS,
} from './rules/scoring-rules';

@Injectable()
export class FinancialAnalysisService {
  private logger = new Logger(FinancialAnalysisService.name);

  constructor(private prismaService: PrismaService) {}

  async calculateScoreByUser(userId: number) {
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
      const diffInDays = DateTime.fromISO(lastCreditEvaluation.evaluationDate).diff(
        DateTime.fromISO(this.allowedTimeToReevaluateStartDate()),
        'days',
      ).days;

      // Return a message indicating that it's too early to reevaluate, try in X days
      return { earlyUntil: diffInDays };
    }

    // 6. Proceed to evaluate
    await this.evaluateCreditByUser(user);
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

  async evaluateCreditByUser(user: User) {
    const lastCreditEvaluation = await this.prismaService.creditEvaluation.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        evaluationDate: 'desc',
      },
    });

    // If is greater than now - 1 week proceed to reevaluate, instead NO proceed with evaluation
    if (
      lastCreditEvaluation &&
      !this.metWithTimeToReevaluate(lastCreditEvaluation.evaluationDate)
    ) {
      return;
    }

    // Obtain all transactions made from 3 months ago
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        userId: user.id,
        createdAt: {
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
      return;
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

    const firstReceiptDate = lastTransaction.createdAt;

    const residenceAgeScore = this.calculateResidenceAgeScore(firstReceiptDate);

    const firstSalaryDate = lastTransaction.createdAt;

    const employmentStabilityScore = this.calculateEmploymentStabilityScore(firstSalaryDate);

    // TODO: Evaluate social media
    const evaluation = {
      bankTransactions: transactions.length * SCORE_BY_CATEGORY.BANK_TRANSACTIONS,
      billPayment: billPaymentScore,
      residenceAge: residenceAgeScore,
      socialMedia: 0,
      stabilityEmployment: employmentStabilityScore,
    };

    return evaluation;
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
