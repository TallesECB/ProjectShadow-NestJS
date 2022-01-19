import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import Extension from '@joi/date';
import { AddressRegex } from '../utils/regex';
const JoiDate = Joi.extend(Extension);

export class SearchTransactionDto {
    @ApiProperty({
        description: 'The wallet id',
        required: false,
        readOnly: true
    })
    @JoiSchema(Joi.string().regex(AddressRegex))
    receiveFrom?: string;

    @ApiProperty({
        description: 'The wallet id',
        required: false,
        readOnly: true
    })
    @JoiSchema(Joi.string().regex(AddressRegex))
    sendTo?: string;

    @ApiProperty({
        description: 'The Value Coin'
    })
    @JoiSchema(Joi.number())
    value?: number;

    @ApiProperty({
        description: 'The Current Cotation Coin'
    })
    @JoiSchema(Joi.number())
    currentCotation?: number;

    @JoiSchema(
JoiDate.date()
        .format('DD/MM/YYYY')
        .messages({ 'date.format': `{#label} with value {:[.]} fails to match the required format: DD/MM/YYYY` })
    )
    datetime?: Date;

    limit?: number;
    page?: number;
}
