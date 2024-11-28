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
    fs.copyFile(filePath, path.join('dist', filePath), (err) => {
      if (err) {
        console.log('复制到 dist 时发生错误: ', err?.message);
      }
    });
  }
}

/** 将静态文件删除同步到 dist 中 */
export function syncDeleteFromDist(filePath: string) {
  if (isNestStart()) {
    try {
      fs.unlinkSync(path.join('dist', filePath));
    } catch (e) {}
  }
}

export function syncCreateFolder(folderPath: string) {
  if (isNestStart()) {
    fs.mkdirSync(path.join('dist', folderPath), { recursive: true });
  }
}

export function syncRemoveFolder(folderPath: string) {
  if (isNestStart()) {
    fs.rmdirSync(path.join('dist', folderPath));
  }
}
