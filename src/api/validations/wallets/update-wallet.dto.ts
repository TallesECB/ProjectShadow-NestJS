import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateWalletDto } from './create-wallet.dto';
import { UPDATE, JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  @ApiProperty()
  @JoiSchema(Joi.string().trim().alphanum().min(2).max(30))
  @JoiSchema([UPDATE], Joi.string().trim().alphanum().min(2).max(30).optional())
  @IsString()
  @IsOptional()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @JoiSchema(Joi.string().trim().length(14))
  @JoiSchema([UPDATE], Joi.string().trim().length(14).optional())
  @IsString()
  @IsOptional()
  cpf: string;

  @ApiProperty()
  @JoiSchema(Joi.string().trim())
  @JoiSchema([UPDATE], Joi.string().trim().optional())
  @IsString()
  @IsOptional()
  birthdate: string;
}
