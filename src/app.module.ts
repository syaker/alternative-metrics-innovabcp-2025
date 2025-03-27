import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';

import { AppService } from './app.service';
import configuration from './config/configuration';
import { MercadoLibreModule } from './lib/mercado-libre/mercado-libre.module';
import { MetaModule } from './lib/meta/meta.module';
import { YapeModule } from './lib/yape/yape.module';
import { FinancialAnalysisModule } from './modules/financial-analysis/financial-analysis.module';
import { VersionModule } from './modules/version/version.module';

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
    SwaggerModule,
    VersionModule,
  ],
  providers: [AppService],
})
export class AppModule {}
