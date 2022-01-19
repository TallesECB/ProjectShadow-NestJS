import { ApiProperty } from '@nestjs/swagger';
import { CoinDto } from './coin.dto';

export class ListCoinsDto {
  @ApiProperty({
    description: 'List of Coins For this Wallet',
    isArray: true,
    type: () => CoinDto
  })
  coins: CoinDto[];
}
