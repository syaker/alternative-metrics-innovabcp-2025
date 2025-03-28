import { Module } from '@nestjs/common';
import { BedrockService } from './bedrock/bedrock.service';

@Module({
  providers: [BedrockService],
})
export class AwsModule {}
