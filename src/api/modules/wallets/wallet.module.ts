import { Module } from '@nestjs/common';
import { WalletService } from '../../service/wallets/wallet.service';
import { WalletController } from '../../controller/wallets/wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../../models/wallet.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletController],
  providers: [WalletService]
})
export class WalletModule {}
