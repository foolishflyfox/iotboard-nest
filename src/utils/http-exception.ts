import { HttpException, HttpStatus } from '@nestjs/common';

export const customErrorCode = {
  bizErrorCode: 601,
};

export function createHttpException(msg: string, code?: number) {
  return new HttpException(msg, code || HttpStatus.INTERNAL_SERVER_ERROR);
}

export function createHttpBizException(msg: string) {
  return new HttpException(msg, customErrorCode.bizErrorCode);
}
