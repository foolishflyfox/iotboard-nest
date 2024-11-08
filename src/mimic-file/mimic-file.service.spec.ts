import { Test, TestingModule } from '@nestjs/testing';
import { MimicFileService } from './mimic-file.service';

describe('MimicFileService', () => {
  let service: MimicFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MimicFileService],
    }).compile();

    service = module.get<MimicFileService>(MimicFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
