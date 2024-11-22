import * as fs from 'fs';
import path from 'path';
/** 判断是否以 nest 命令启动，例如 nest start */
export const isNestStart = (function () {
  const isDistExist = fs.existsSync('dist/main.js');
  return () => isDistExist;
})();

/** 将静态文件同步到 dist 中，否则前端不能获取 */
export function syncUploadToDist(filePath: string) {
  if (isNestStart()) {
    fs.copyFile(filePath, path.join('dist', filePath), (err) => {});
  }
}
