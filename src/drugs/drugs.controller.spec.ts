import { Test, TestingModule } from '@nestjs/testing';
import { DrugsController } from './drugs.controller';

describe('DrugsController', () => {
  let controller: DrugsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrugsController],
    }).compile();

    controller = module.get<DrugsController>(DrugsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
