import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { AppConfigService } from 'src/app-config/app-config.service';
import { MimicFileType } from './types';
import { FileSystemService } from 'src/file-system/file-system.service';
import * as _ from 'lodash-es';

@Injectable()
export class MimicFileService {
  constructor(
    private fileSystemService: FileSystemService,
    private appConfigService: AppConfigService,
  ) {}

  getFileTree(fileType: MimicFileType) {
    const rootTree = this.fileSystemService.traverseFileTree(
      path.join(this.appConfigService.getData().path, `${fileType}s`),
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
}
