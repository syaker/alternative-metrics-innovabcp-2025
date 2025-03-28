import { Module } from '@nestjs/common';
import { YapeService } from './yape.service';

@Module({
  providers: [YapeService],
})
export class YapeModule {
  getTransactions() {}
}
