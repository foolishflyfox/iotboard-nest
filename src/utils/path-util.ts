import path from 'path';

/** 将路径的文件后缀去除 */
export function pathWithoutExt(originPath: string) {
  const dirName = path.dirname(originPath);
  const fileNameWithoutExt = path.basename(originPath, path.extname(originPath));
  return path.join(dirName, fileNameWithoutExt);
}
