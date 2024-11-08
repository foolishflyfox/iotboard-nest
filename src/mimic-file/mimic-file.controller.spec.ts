import { Test, TestingModule } from '@nestjs/testing';
import { MimicFileController } from './mimic-file.controller';

describe('MimicFileController', () => {
  let controller: MimicFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MimicFileController],
    }).compile();

    controller = module.get<MimicFileController>(MimicFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
