import { Module } from '@nestjs/common';
import { YapeController } from './yape.controller';
import { YapeService } from './yape.service';

@Module({
  controllers: [YapeController],
  providers: [YapeService]
})
export class YapeModule {}
