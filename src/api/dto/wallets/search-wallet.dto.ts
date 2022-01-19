import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import Extension from '@joi/date';
import { AddressRegex } from '../utils/regex';
import { CpfRegex } from '../utils/regex';
const JoiDate = Joi.extend(Extension);

export class SearchWalletDto {
  @ApiProperty({
    description: 'Person name',
    required: false
  })
  @JoiSchema(Joi.string().trim().min(7).max(30))
  name?: string;

  @ApiProperty({
    description: 'Person name',
    required: false
  })
  @JoiSchema(
    Joi.string()
      .trim()
      .regex(CpfRegex)
      .messages({
        'string.pattern.base': `{#label} with value {:[.]} fails to match the required pattern format: xxx.xxx.xxx-xx`
      })
      .min(2)
      .max(30)
  )
  cpf?: string;

  @ApiProperty({
    description: 'Person birth date',
    example: '14/11/1994',
    required: false
  })
  @JoiSchema(
    JoiDate.date()
      .format('DD/MM/YYYY')
      .messages({ 'date.format': `{#label} with value {:[.]} fails to match the required format: DD/MM/YYYY` })
  )
  birthdate?: string;

  @ApiProperty({
    description: 'The wallet id',
    required: false,
    readOnly: true
  })
  @JoiSchema(Joi.string().regex(AddressRegex))
  address?: string;

  limit?: number;
  page?: number;
}
