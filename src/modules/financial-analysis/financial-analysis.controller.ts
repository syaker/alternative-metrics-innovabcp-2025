import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-new-profile.dto';
import { FinancialAnalysisService } from './financial-analysis.service';

@Controller('financial-analysis')
export class FinancialAnalysisController {
  constructor(private financialAnalysisService: FinancialAnalysisService) {}

  @Get()
  calculateScore(@Query() userId: string) {
    return this.financialAnalysisService.calculateScoreByUser(Number(userId));
  }

  @Post()
  createNewProfile(
    @Body()
    body: CreateUserDto,
  ) {
    return this.financialAnalysisService.createNewProfile(body);
  }

  @Get()
  getRecommendationsForUser(@Query() query: Request) {
    return this.financialAnalysisService.getRecommendationsForUser();
  }

  @Put()
  uploadFilesForProcessing(@Body() body: Request) {
    return this.financialAnalysisService.uploadFilesForProcessing();
  }
}
