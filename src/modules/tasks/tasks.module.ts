import { Module } from '@nestjs/common';
import { BedrockService } from '../../lib/aws/bedrock/bedrock.service';
import { MercadoLibreService } from '../../lib/mercado-libre/mercado-libre.service';
import { MetaService } from '../../lib/meta/meta.service';
import { YapeService } from '../../lib/yape/yape.service';
import { FinancialAnalysisService } from '../financial-analysis/financial-analysis.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    FinancialAnalysisService,
    BedrockService,
    MercadoLibreService,
    MetaService,
    YapeService,
  ],
})
export class TasksModule {}
