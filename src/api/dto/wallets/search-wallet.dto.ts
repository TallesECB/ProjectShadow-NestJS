import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import { AddressRegex } from '../utils/regex';

export class SearchWalletDto {
  @ApiProperty({
    description: 'Person name',
    required: false
  })
  name?: string;

  @ApiProperty({
    description: 'Person name',
    required: false
  })
  cpf?: string;

  @ApiProperty({
    description: 'Person birth date',
    example: '14/11/1994',
    required: false
  })
  birthdate?: string;

  @ApiProperty({
    description: 'The wallet id',
    required: false,
    readOnly: true
  })
  @JoiSchema(Joi.string().regex(AddressRegex))
  address?: string;
}
