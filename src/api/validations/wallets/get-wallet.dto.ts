import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';


export class GetWalletDto {
  @ApiProperty()
  @JoiSchema(Joi.string().trim().alphanum().min(2).max(30).optional())
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @JoiSchema(Joi.string().trim().length(14).optional())
  @IsString()
  @IsOptional()
  cpf: string;

  @ApiProperty()
  @JoiSchema(Joi.string().trim().optional())
  @IsString()
  @IsOptional()
  birthdate: string;
}
