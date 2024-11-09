import dayjs from 'dayjs';
import { HttpResult } from 'src/types';

export const httpResultUtil = {
  /** 生成请求成功的响应体 */
  success<T>(result?: T): HttpResult<T> {
    return {
      code: 200,
      result,
      timestamp: dayjs().format(),
    };
  },
  /** 生成请求失败的响应体 */
  fail(msg: string, code?: number): HttpResult<void> {
    return {
      code: code || 500,
      msg,
      timestamp: dayjs().format(),
    };
  },
};
