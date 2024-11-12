import { Injectable } from '@nestjs/common';
import { FileTreeNode } from './interfaces/file-tree-node.interface';
import * as fs from 'fs';
import * as path from 'path';
import { SaveFileResult } from 'src/types';

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
    pathProcessor?: (filePath: string) => string,
  ): FileTreeNode | null {
    if (!fs.existsSync(startPath)) {
      return null;
    }
    const basename = path.basename(startPath);
    const curPath = pathProcessor ? pathProcessor(startPath) : startPath;
    const stat = fs.statSync(startPath);
    if (stat.isDirectory()) {
      const subItems = fs.readdirSync(startPath);
      return {
        name: basename,
        path: curPath,
        children: subItems
          .map((f) => path.join(startPath, f))
          .map((f) => this.traverseFileTree(f, filters, pathProcessor)!)
          .filter((f) => f !== null),
      };
    }

    for (const filter of filters || []) {
      if (!filter(basename)) return null;
    }
    return { name: basename, path: curPath };
  }
  /**
   * 按指定路径创建文件夹
   * @param folderPath 指定路径名
   * @returns
   */
  createFolder(folderPath: string): string {
    if (fs.existsSync(folderPath)) {
      return `文件夹 ${folderPath} 已存在`;
    } else {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }
  /**
   * 删除指定路径的文件夹
   * @param folderPath 指定路径名
   * @returns
   */
  removeFolder(folderPath: string): string {
    if (fs.existsSync(folderPath)) {
      fs.rmdirSync(folderPath);
    } else {
      return `文件夹 ${folderPath} 不存在`;
    }
  }
  /**
   * 为指定文件/文件夹重命名
   * @param oldPath 旧路径名
   * @param newPath 新路径名
   * @returns
   */
  rename(oldPath: string, newPath: string): string {
    if (fs.existsSync(newPath)) {
      console.log('@@@@');
      return `${newPath} 已存在`;
    } else {
      fs.renameSync(oldPath, newPath);
    }
  }
  /**
   * 列出指定文件夹下的文件名
   * @param folderPath 文件夹路径
   * @param filters 文件名过滤器
   */
  list(folderPath: string, filters?: ((filename: string) => boolean)[]) {
    let allSubs = fs.readdirSync(folderPath);
    return allSubs.filter((e) => {
      for (const filter of filters) {
        if (!filter(e)) return false;
      }
      return true;
    });
  }

  write(filePath: string, content: string, overwrite?: boolean): SaveFileResult {
    if (!overwrite && fs.existsSync(filePath)) {
      return SaveFileResult.FileExisted;
    }
    fs.writeFileSync(filePath, content);
    return SaveFileResult.Success;
  }
}
