export interface FileTreeNode {
  /** 文件夹/文件 名 */
  name: string;
  /** 子文件夹/文件 */
  children?: FileTreeNode[];
}
