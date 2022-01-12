import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { CREATE, JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateWalletDto {
  @ApiProperty()
  @JoiSchema(Joi.string().trim().alphanum().min(2).max(30).required())
  @JoiSchema([CREATE], Joi.string().trim().alphanum().min(2).max(30).required())
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @JoiSchema(Joi.string().trim().length(14).required())
  @JoiSchema([CREATE], Joi.string().trim().length(14).required())
  @IsString()
  cpf: string;

  @ApiProperty()
  @JoiSchema(Joi.string().trim().required())
  @JoiSchema([CREATE], Joi.string().trim().required())
  @IsString()
  birthdate: string;
}
