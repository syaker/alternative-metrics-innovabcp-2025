import { Module } from '@nestjs/common';
import { FinancialAnalysisService } from '../financial-analysis/financial-analysis.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksController } from './tasks.controller';
import { TaskService } from './tasks.service';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TaskService, FinancialAnalysisService],
})
export class TasksModule {}
