import { Module } from '@nestjs/common';
import { BedrockService } from '../../lib/aws/bedrock/bedrock.service';
import { FinancialAnalysisService } from '../financial-analysis/financial-analysis.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TasksService, FinancialAnalysisService, BedrockService],
})
export class TasksModule {}
