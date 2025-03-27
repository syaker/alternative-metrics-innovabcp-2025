import { Test, TestingModule } from '@nestjs/testing';
import { FinancialAnalysisController } from './financial-analysis.controller';

describe('FinancialAnalysisController', () => {
  let controller: FinancialAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialAnalysisController],
    }).compile();

    controller = module.get<FinancialAnalysisController>(FinancialAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
