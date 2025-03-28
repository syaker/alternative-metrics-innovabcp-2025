import { Module } from '@nestjs/common';
import { BedrockService } from '../../lib/aws/bedrock/bedrock.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FinancialAnalysisController } from './financial-analysis.controller';
import { FinancialAnalysisService } from './financial-analysis.service';

@Module({
  imports: [PrismaModule],
  controllers: [FinancialAnalysisController],
  providers: [FinancialAnalysisService, BedrockService],
})
export class FinancialAnalysisModule {}
