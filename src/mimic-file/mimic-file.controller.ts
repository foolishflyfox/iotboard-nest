import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MimicFileType } from './types';
import { MimicFileService } from './mimic-file.service';
import { httpResultUtil } from 'src/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';

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

  @Post('create')
  create(
    @Body('fileType') fileType: MimicFileType,
    @Body('filePath') filePath: string,
    @Body('content') content: string,
  ) {
    this.mimicFileService.saveFile(fileType, filePath, content);
    return httpResultUtil.success();
  }

  @Post('save')
  save(
    @Body('fileType') fileType: MimicFileType,
    @Body('filePath') filePath: string,
    @Body('content') content: string,
  ) {
    this.mimicFileService.saveFile(fileType, filePath, content, true);
    return httpResultUtil.success();
  }

  @Post('delete')
  delete(@Body('fileType') fileType: MimicFileType, @Body('filePath') filePath: string) {
    this.mimicFileService.deleteFile(fileType, filePath);
    return httpResultUtil.success();
  }

  /** 打开图纸/模块/组件 */
  @Post('open')
  open(@Body('fileType') fileType: MimicFileType, @Body('filePath') filePath: string) {
    const result = this.mimicFileService.readFile(fileType, filePath);
    return httpResultUtil.success(result);
  }

  @Post('upload/:destPath(.*)')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const destPath = req.params.destPath;
          callback(null, path.join('app-data', destPath));
        },
        filename: (req, file, callback) => {
          const fileName = path.basename(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    // console.log('receive file:', file);
    return httpResultUtil.success('ok');
  }

  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return httpResultUtil.success('ok');
  }
}
