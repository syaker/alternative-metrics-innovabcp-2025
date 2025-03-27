import { Test, TestingModule } from '@nestjs/testing';
import { YapeController } from './yape.controller';

describe('YapeController', () => {
  let controller: YapeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YapeController],
    }).compile();

    controller = module.get<YapeController>(YapeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
