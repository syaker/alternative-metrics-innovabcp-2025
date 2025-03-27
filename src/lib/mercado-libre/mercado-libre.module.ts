import { Module } from '@nestjs/common';
import { MercadoLibreController } from './mercado-libre.controller';
import { MercadoLibreService } from './mercado-libre.service';

@Module({
  controllers: [MercadoLibreController],
  providers: [MercadoLibreService]
})
export class MercadoLibreModule {}
