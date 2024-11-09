import { HttpException, HttpStatus } from '@nestjs/common';

export function createHttpException(msg: string, code?: number) {
  return new HttpException(msg, code || HttpStatus.INTERNAL_SERVER_ERROR);
}
