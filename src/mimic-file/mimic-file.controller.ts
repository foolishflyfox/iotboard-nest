import { Controller, Get, Param } from '@nestjs/common';
import { MimicFileType } from './types';
import { MimicFileService } from './mimic-file.service';

@Controller('mimic/file')
export class MimicFileController {
  constructor(private mimicFileService: MimicFileService) {}

  @Get('tree/:type')
  fileTree(@Param('type') fileType: MimicFileType) {
    return this.mimicFileService.getFileTree(fileType);
  }
}
