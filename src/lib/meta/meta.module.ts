import { Module } from '@nestjs/common';
import { MetaService } from './meta.service';

@Module({
  providers: [MetaService],
})
export class MetaModule {}
