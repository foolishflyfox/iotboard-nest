import { Injectable } from '@nestjs/common';
import { FileTreeNode } from './interfaces/file-tree-node.interface';

@Injectable()
export class FileSystemService {
  traverseFileTree(startPath: string): FileTreeNode {
    return { name: 'xxx' };
  }
}
