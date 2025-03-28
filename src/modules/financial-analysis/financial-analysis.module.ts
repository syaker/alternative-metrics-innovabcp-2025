import { Module } from '@nestjs/common';
import { BedrockService } from '../../lib/aws/bedrock/bedrock.service';
import { MercadoLibreService } from '../../lib/mercado-libre/mercado-libre.service';
import { MetaService } from '../../lib/meta/meta.service';
import { YapeService } from '../../lib/yape/yape.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FinancialAnalysisController } from './financial-analysis.controller';
import { FinancialAnalysisService } from './financial-analysis.service';

@Module({
  imports: [PrismaModule],
  controllers: [FinancialAnalysisController],
  providers: [
    FinancialAnalysisService,
    BedrockService,
    MercadoLibreService,
    MetaService,
    YapeService,
  ],
})
export class FinancialAnalysisModule {}
