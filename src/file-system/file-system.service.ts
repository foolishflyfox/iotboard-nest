import { Injectable } from '@nestjs/common';
import { FileTreeNode } from './interfaces/file-tree-node.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileSystemService {
  /** 创建指定后缀名的文件名过滤器 */
  createIncludeExtFilter(...exts: string[]) {
    exts = exts.map((e) => `.${e}`);
    return (filename: string) => {
      return exts.includes(path.extname(filename));
    };
  }
  /**
   * 获取 startPath 开始的目录树
   * @param startPath 开始路径
   * @param filters 文件名过滤器
   * @returns
   */
  traverseFileTree(
    startPath: string,
    filters?: ((filename: string) => boolean)[],
  ): FileTreeNode | null {
    if (!fs.existsSync(startPath)) {
      return null;
    }
    const basename = path.basename(startPath);
    const stat = fs.statSync(startPath);
    if (stat.isDirectory()) {
      const subItems = fs.readdirSync(startPath);
      return {
        name: basename,
        children: subItems
          .map((f) => path.join(startPath, f))
          .map((f) => this.traverseFileTree(f, filters)!)
          .filter((f) => f !== null),
      };
    }

    for (const filter of filters || []) {
      if (!filter(basename)) return null;
    }
    return { name: basename };
  }
  createFolder(folderPath: string): string {
    if (fs.existsSync(folderPath)) {
      return `文件夹 ${folderPath} 已存在`;
    } else {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }
  removeFolder(folderPath: string): string {
    if (fs.existsSync(folderPath)) {
      fs.rmdirSync(folderPath);
    } else {
      return `文件夹 ${folderPath} 不存在`;
    }
  }
  rename(oldPath: string, newPath: string): string {
    if (fs.existsSync(newPath)) {
      console.log('@@@@');
      return `${newPath} 已存在`;
    } else {
      fs.renameSync(oldPath, newPath);
    }
  }
}
