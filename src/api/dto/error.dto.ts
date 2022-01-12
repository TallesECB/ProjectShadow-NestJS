import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty({
    description: 'Name of the error'
  })
  name: string;

  @ApiProperty({
    description: 'Description of the error'
  })
  description: string;
}
