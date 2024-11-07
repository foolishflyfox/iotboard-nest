import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// 注意: 你不必自己构建通用验证管道，因为 ValidationPipe 由 Nest 开箱即用
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  // 每个管道都必须实现 PipeTransform<T, R> 接口，T 表示输入 value 的类型，R 表示 transform 方法的返回类型
  // value 参数是当前处理的方法参数
  // metadata 是当前处理的方法参数的元数据，元数据对象有以下属性
  // type: 指示参数是 body、query、param 还是自定义的
  // data: 传递给装饰器的字符串
  // metatype: 提供参数的目标类型，例如 String、Number
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // if (!metatype || !this.toValidate(metatype)) return value;
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Number, Array, Boolean, Object];
    return types.includes(metatype);
  }
}
