import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import { AddressRegex } from '../utils/regex';

export class AddressDto {
  @ApiProperty({
    description: 'The wallet id'
  })
  @JoiSchema(
    Joi.string()
      .regex(AddressRegex)
      .messages({
        'string.pattern.base': `{#label} with value {:[.]} fails to match the required pattern format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
      })
      .min(36)
      .max(36)
  )
  address: string;
}
