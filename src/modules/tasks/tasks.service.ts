import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CreditType } from '@prisma/client';
import { FinancialAnalysisService } from '../financial-analysis/financial-analysis.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(
    private financialAnalysisService: FinancialAnalysisService,
    private prismaService: PrismaService,
  ) {}

  // !NOTE Executing each 2 minutes for testing purposes
  @Cron('*/2 * * * *')
  async handleTask() {
    console.log('Executing scheduled task...');

    const users = await this.prismaService.user.findMany({
      where: {
        creditEvaluations: {
          every: {
            evaluationDate: {
              gte: this.financialAnalysisService.allowedTimeToReevaluateStartDate(),
            },
          },
        },
      },
    });

    await Promise.all(
      users.map(async (user) => {
        const creditTypes = Object.values(CreditType);

        const evaluations = await Promise.all(
          creditTypes.map(async (creditType) =>
            this.financialAnalysisService.evaluateCreditByUser(user, creditType),
          ),
        );

        const validEvaluations = evaluations.filter((e) => e !== null);

        if (validEvaluations.length === 0) {
          return;
        }

        await this.prismaService.creditEvaluation.createMany({
          data: validEvaluations.map((evaluation) => ({
            creditType: evaluation.creditType,
            riskLevel: evaluation.transactionsReport.riskLevel,
            score: evaluation.transactionsReport.score,
            status: evaluation.transactionsReport.status,
            avgMonthlyExpense: evaluation.transactionsReport.avgMonthlyExpense,
            avgMonthlyIncome: evaluation.transactionsReport.avgMonthlyIncome,
            totalTransactions: evaluation.transactionsReport.totalTransactions,
            totalExpenses: evaluation.transactionsReport.totalTransactionExpensesAmount,
            totalIncome: evaluation.transactionsReport.totalTransactionIncomingAmount,
            debtRatio: evaluation.transactionsReport.debtRatio,
            reliabilityScore: evaluation.transactionsReport.reliabilityScore,
            userId: evaluation.userId,
          })),
        });
      }),
    );
  }
}
