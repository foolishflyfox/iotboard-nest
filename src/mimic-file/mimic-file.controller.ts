import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MimicFileType } from './types';
import { MimicFileService } from './mimic-file.service';
import { httpResultUtil } from 'src/utils';

@Controller('mimic/file')
export class MimicFileController {
  constructor(private mimicFileService: MimicFileService) {}

  @Get('tree/:type')
  fileTree(@Param('type') fileType: MimicFileType) {
    const result = this.mimicFileService.getFileTree(fileType);
    return httpResultUtil.success(result);
  }

  @Post('mkdir')
  mkdir(
    @Body('fileType') fileType: MimicFileType,
    @Body('folderPath') folderPath: string,
  ) {
    this.mimicFileService.createFolder(fileType, folderPath);
    return httpResultUtil.success();
  }
}
