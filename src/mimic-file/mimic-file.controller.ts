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
  mkdir(@Body('fileType') fileType: MimicFileType, @Body('folderPath') folderPath: string) {
    this.mimicFileService.createFolder(fileType, folderPath);
    return httpResultUtil.success();
  }

  @Post('rmdir')
  rmdir(@Body('fileType') fileType: MimicFileType, @Body('folderPath') folderPath: string) {
    this.mimicFileService.removeFolder(fileType, folderPath);
    return httpResultUtil.success();
  }

  @Post('renameDir')
  renameDir(
    @Body('fileType') fileType: MimicFileType,
    @Body('folderPath') folderPath: string,
    @Body('newName') newName: string,
  ) {
    this.mimicFileService.renameFolder(fileType, folderPath, newName);
    return httpResultUtil.success();
  }

  @Post('list')
  listFiles(@Body('fileType') fileType: MimicFileType, @Body('folderPath') folderPath: string) {
    const result = this.mimicFileService.listSubFile(fileType, folderPath);
    return httpResultUtil.success(result);
  }
}
