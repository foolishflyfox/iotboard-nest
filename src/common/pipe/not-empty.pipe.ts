import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class NotEmptyPipe implements PipeTransform<string | Array<any>> {
  transform(value: string | any[], metadata: ArgumentMetadata) {
    if (!value || value.length === 0) {
      throw new BadRequestException(`${metadata.data} cann't be empty`);
    }
    return value;
  }
}
