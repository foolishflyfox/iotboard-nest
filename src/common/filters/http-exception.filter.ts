import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { customErrorCode, httpResultUtil } from 'src/utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();
    let status = exception.getStatus();
    if (status === customErrorCode.bizErrorCode) status = HttpStatus.OK;
    response
      .status(status)
      .json(httpResultUtil.fail(exception.message, status));
  }
}
