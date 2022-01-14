import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import Extension from '@joi/date';
import { CpfRegex } from '../utils/regex';
import { AddressRegex } from '../utils/regex';

const JoiDate = Joi.extend(Extension);

export class WalletDto {
  @ApiProperty({
    description: 'The wallet id',
    required: false,
    readOnly: true
  })
  @JoiSchema(Joi.string().regex(AddressRegex))
  address: string;

  @ApiProperty({
    description: 'The Wallet Person Name'
  })
  @JoiSchema(Joi.string().trim().min(7).max(30).required())
  name: string;

  @ApiProperty({
    description: 'The Wallet Person CPF'
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
      .required()
  )
  cpf: string;

  @ApiProperty({
    description: 'The Wallet Person Birth Date',
    example: '14/11/1994'
  })
  @JoiSchema(
    JoiDate.date()
      .format('DD/MM/YYYY')
      .messages({ 'date.format': `{#label} with value {:[.]} fails to match the required format: DD/MM/YYYY` })
      .required()
  )
  birthdate: Date;

  @ApiProperty({
    description: 'The Wallet Created Date',
    example: '14/11/1994'
  })
  created_at: Date;

  @ApiProperty({
    description: 'The Wallet Updated Date',
    example: '14/11/1994'
  })
  updated_at: Date;
}
