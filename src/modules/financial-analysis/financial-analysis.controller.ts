import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreditType } from '@prisma/client';
import { CreateUserDto } from './dto/create-new-profile.dto';
import { FinancialAnalysisService } from './financial-analysis.service';

@ApiTags('Financial Analysis')
@Controller('financial-analysis')
export class FinancialAnalysisController {
  constructor(private financialAnalysisService: FinancialAnalysisService) {}

  @Post(':userId/score')
  @ApiOperation({ summary: 'Calculate user score based on financial history' })
  calculateScore(
    @Param('userId') userId: string,
    @Query('creditType') creditType: CreditType,
    @Body() imageBase64?: string,
  ) {
    return this.financialAnalysisService.processUserCreditEvaluation(
      Number(userId),
      creditType,
      imageBase64,
    );
  }

  @Post('users')
  @ApiOperation({ summary: 'Create a new user profile' })
  createNewProfile(
    @Body()
    body: CreateUserDto,
  ) {
    return this.financialAnalysisService.createNewProfile(body);
  }
}
