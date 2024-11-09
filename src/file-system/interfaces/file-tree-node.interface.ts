export interface FileTreeNode {
  /** 文件夹/文件 名 */
  name: string;
  /** 文件夹/文件 路径 */
  path: string;
  /** 子文件夹/文件 */
  children?: FileTreeNode[];
}
