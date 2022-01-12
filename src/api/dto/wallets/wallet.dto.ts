import { ApiProperty } from '@nestjs/swagger';

export class WalletDto {
  @ApiProperty({
    description: 'The wallet id',
    required: false,
    readOnly: true
  })
  address: string;

  @ApiProperty({
    description: 'The Wallet Person name'
  })
  name: string;

  @ApiProperty({
    description: 'The Wallet Person CPF'
  })
  cpf: string;

  @ApiProperty({
    description: 'The Wallet Person birth date',
    example: '14/11/1994'
  })
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
