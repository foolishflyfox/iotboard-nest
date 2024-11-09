import { HttpException, Injectable } from '@nestjs/common';
import * as path from 'path';
import { AppConfigService } from 'src/app-config/app-config.service';
import { MimicFileType } from './types';
import { FileSystemService } from 'src/file-system/file-system.service';
import _ from 'lodash';
import { createHttpBizException, createHttpException } from 'src/utils';

@Injectable()
export class MimicFileService {
  constructor(
    private fileSystemService: FileSystemService,
    private appConfigService: AppConfigService,
  ) {}

  private getRootDir(fileType: MimicFileType) {
    return path.join(this.appConfigService.getData().path, `${fileType}s`);
  }

  private getTargetPath(fileType: MimicFileType, targetPath: string) {
    return path.join(this.getRootDir(fileType), targetPath);
  }

  getFileTree(fileType: MimicFileType) {
    const rootTree = this.fileSystemService.traverseFileTree(
      this.getRootDir(fileType),
      [this.fileSystemService.createIncludeExtFilter('json')],
      (filePath) => path.join(...filePath.split(path.sep).slice(2)),
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
    const errorMsg = this.fileSystemService.createFolder(this.getTargetPath(fileType, folderPath));
    if (!_.isEmpty(errorMsg)) throw createHttpBizException(errorMsg);
  }

  removeFolder(fileType: MimicFileType, folderPath: string) {
    const errorMsg = this.fileSystemService.removeFolder(this.getTargetPath(fileType, folderPath));
    if (!_.isEmpty(errorMsg)) throw createHttpBizException(errorMsg);
  }

  renameFolder(fileType: MimicFileType, folderPath: string, newName: string) {
    const oldPath = this.getTargetPath(fileType, folderPath);
    const newPath = path.join(path.dirname(oldPath), newName);
    const errorMsg = this.fileSystemService.rename(oldPath, newPath);
    console.log('errorMsg = ', errorMsg);
    if (!_.isEmpty(errorMsg)) throw createHttpBizException(errorMsg);
  }

  listSubFile(fileType: MimicFileType, folderPath: string) {
    const fileNames = this.fileSystemService.list(this.getTargetPath(fileType, folderPath), [
      this.fileSystemService.createIncludeExtFilter('json', 'png'),
    ]);
    const resultDict: Record<string, { name: string; hasPreview?: boolean }> = {};
    const pngs = [];
    for (const fileName of fileNames) {
      const name = path.parse(fileName).name;
      if (fileName.endsWith('.png')) pngs.push(name);
      else if (fileName.endsWith('.json')) resultDict[name] = { name };
    }
    for (const png of pngs) {
      if (resultDict[png]) {
        resultDict[png].hasPreview = true;
      }
    }
    return _.values(resultDict);
  }
}
