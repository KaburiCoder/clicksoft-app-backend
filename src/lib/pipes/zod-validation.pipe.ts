import { PipeTransform, ArgumentMetadata, BadRequestException, applyDecorators, UsePipes, UseInterceptors } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) { }

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Validation failed');
    }
  }
}

export function ZodValidate(schema: ZodSchema, dto: new (...args: any[]) => {}) {
  return applyDecorators(
    UsePipes(new ZodValidationPipe(schema)),
    UseInterceptors(new SerializeInterceptor(dto)),
  );
}

