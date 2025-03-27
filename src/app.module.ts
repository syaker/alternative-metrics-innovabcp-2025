import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { MercadoLibreModule } from './lib/mercado-libre/mercado-libre.module';
import { MetaModule } from './lib/meta/meta.module';
import { YapeModule } from './lib/yape/yape.module';
import { FinancialAnalysisModule } from './modules/financial-analysis/financial-analysis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    YapeModule,
    MetaModule,
    MercadoLibreModule,
    FinancialAnalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
