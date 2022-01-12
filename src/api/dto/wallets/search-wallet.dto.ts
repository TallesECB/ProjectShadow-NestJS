import { ApiProperty } from '@nestjs/swagger';

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
}
