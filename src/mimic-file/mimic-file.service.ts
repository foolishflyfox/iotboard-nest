import { HttpException, Injectable } from '@nestjs/common';
import * as path from 'path';
import { AppConfigService } from 'src/app-config/app-config.service';
import { MimicFileType } from './types';
import { FileSystemService } from 'src/file-system/file-system.service';
import _ from 'lodash';
import { createHttpException } from 'src/utils';

@Injectable()
export class MimicFileService {
  constructor(
    private fileSystemService: FileSystemService,
    private appConfigService: AppConfigService,
  ) {}

  private getRootDir(fileType: MimicFileType) {
    return path.join(this.appConfigService.getData().path, `${fileType}s`);
  }

  getFileTree(fileType: MimicFileType) {
    const rootTree = this.fileSystemService.traverseFileTree(
      this.getRootDir(fileType),
      [this.fileSystemService.createIncludeExtFilter('json')],
    );
    return rootTree?.children || [];
  }

  getDisplayFileTree() {
    return this.getFileTree('display');
  }

  getModuleFileTree() {
    return this.getFileTree('module');
  }

  getComponentFileTree() {
    return this.getFileTree('component');
  }

  createFolder(fileType: MimicFileType, folderPath: string) {
    const errorMsg = this.fileSystemService.createFolder(
      path.join(this.getRootDir(fileType), folderPath),
    );
    if (!_.isEmpty(errorMsg)) throw createHttpException(errorMsg);
  }
}
