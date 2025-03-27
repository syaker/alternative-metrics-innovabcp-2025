import { Test, TestingModule } from '@nestjs/testing';
import { MercadoLibreService } from './mercado-libre.service';

describe('MercadoLibreService', () => {
  let service: MercadoLibreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MercadoLibreService],
    }).compile();

    service = module.get<MercadoLibreService>(MercadoLibreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
