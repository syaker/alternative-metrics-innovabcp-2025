import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FinancialAnalysisController } from './financial-analysis.controller';
import { FinancialAnalysisService } from './financial-analysis.service';

@Module({
  imports: [PrismaModule],
  controllers: [FinancialAnalysisController],
  providers: [FinancialAnalysisService],
})
export class FinancialAnalysisModule {}
