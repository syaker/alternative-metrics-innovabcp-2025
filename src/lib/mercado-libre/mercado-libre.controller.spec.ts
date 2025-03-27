import { Test, TestingModule } from '@nestjs/testing';
import { MercadoLibreController } from './mercado-libre.controller';

describe('MercadoLibreController', () => {
  let controller: MercadoLibreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MercadoLibreController],
    }).compile();

    controller = module.get<MercadoLibreController>(MercadoLibreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
