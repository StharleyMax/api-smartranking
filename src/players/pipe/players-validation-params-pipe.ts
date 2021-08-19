import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class PlayersValidationParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(`value: ${value} metadata: ${metadata.data}`);

    if (!value) {
      throw new BadRequestException(`Value ${metadata.data} not null`);
    }

    return value;
  }
}
