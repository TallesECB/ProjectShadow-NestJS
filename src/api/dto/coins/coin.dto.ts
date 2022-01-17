import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import { IdCoinRegex } from '../utils/regex';

export class CoinDto {
  @ApiProperty({
    description: 'The Coin id',
    required: false,
    readOnly: true
  })
  @JoiSchema(Joi.string().regex(IdCoinRegex))
  idCoin: string;

  @ApiProperty({
    description: 'The quoteTo Coin'
  })
  @JoiSchema(Joi.string().trim().required())
  quoteTo: string;

  @ApiProperty({
    description: 'The currentCoin Coin'
  })
  @JoiSchema(Joi.string().trim().required())
  currentCoin: string;

  @ApiProperty({
    description: 'The Value Coin'
  })
  @JoiSchema(Joi.number().required())
  value: number;

  @ApiProperty({
    description: 'The Coin Created Date',
    example: '14/11/1994'
  })
  created_at: Date;

  @ApiProperty({
    description: 'The Coin Updated Date',
    example: '14/11/1994'
  })
  updated_at: Date;
}
