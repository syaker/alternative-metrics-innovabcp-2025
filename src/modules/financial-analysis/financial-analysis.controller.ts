import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreditType } from '@prisma/client';
import { CreateUserDto } from './dto/create-new-profile.dto';
import { FinancialAnalysisService } from './financial-analysis.service';

@ApiTags('Financial Analysis')
@Controller('financial-analysis')
export class FinancialAnalysisController {
  constructor(private financialAnalysisService: FinancialAnalysisService) {}

  @Get(':userId/score')
  @ApiOperation({ summary: 'Calculate user score based on financial history' })
  calculateScore(@Param('userId') userId: string, @Query('creditType') creditType: CreditType) {
    return this.financialAnalysisService.calculateScoreByUser(Number(userId), creditType);
  }

  @Post('users')
  @ApiOperation({ summary: 'Create a new user profile' })
  createNewProfile(
    @Body()
    body: CreateUserDto,
  ) {
    return this.financialAnalysisService.createNewProfile(body);
  }

  @Get(':userId/recommendations')
  @ApiOperation({ summary: 'Obtain recommendations based on score and financial history' })
  getRecommendationsForUser(@Param('userId') userId: string) {
    return this.financialAnalysisService.getRecommendationsForUser();
  }

  @Put(':userId/files/process')
  @ApiOperation({ summary: 'Upload files to process them with OCR' })
  uploadFilesForProcessing(@Body() body: {}) {
    return this.financialAnalysisService.uploadFilesForProcessing();
  }
}
