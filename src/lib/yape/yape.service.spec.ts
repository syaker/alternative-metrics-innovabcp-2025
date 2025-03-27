import { Test, TestingModule } from '@nestjs/testing';
import { YapeService } from './yape.service';

describe('YapeService', () => {
  let service: YapeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YapeService],
    }).compile();

    service = module.get<YapeService>(YapeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
