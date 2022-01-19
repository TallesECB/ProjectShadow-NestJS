import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import { AddressRegex } from '../utils/regex';

export class TransactionDto {
  @ApiProperty({
    description: 'The wallet id',
    required: false,
    readOnly: true
  })
  @JoiSchema(Joi.string().regex(AddressRegex))
  receiverAddress: string;

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
}
