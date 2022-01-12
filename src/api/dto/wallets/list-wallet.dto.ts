import { ApiProperty } from '@nestjs/swagger';
import { WalletDto } from './wallet.dto';

export class ListWalletDto {
  @ApiProperty({
    description: 'List of Wallets',
    isArray: true,
    type: () => WalletDto
  })
  wallets: WalletDto[];
}
