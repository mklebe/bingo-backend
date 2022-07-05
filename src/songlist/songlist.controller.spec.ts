import { Test, TestingModule } from '@nestjs/testing';
import { SongListController } from './songlist.controller';

describe('DrugsController', () => {
  let controller: SongListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongListController],
    }).compile();

    controller = module.get<SongListController>(SongListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
