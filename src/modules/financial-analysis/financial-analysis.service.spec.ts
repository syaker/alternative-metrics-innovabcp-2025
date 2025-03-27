import { Test, TestingModule } from '@nestjs/testing';
import { FinancialAnalysisService } from './financial-analysis.service';

describe('FinancialAnalysisService', () => {
  let service: FinancialAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialAnalysisService],
    }).compile();

    service = module.get<FinancialAnalysisService>(FinancialAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
