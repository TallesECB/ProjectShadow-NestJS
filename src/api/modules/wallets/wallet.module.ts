import { Module } from '@nestjs/common';
import { WalletService } from '../../service/wallets/wallet.service';
import { WalletController } from '../../controller/wallets/wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../../models/wallet.entity';
import { Coins } from '../../models/coins.entity';
import { Transactions } from '../../models/transactions.entity';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Coins, Transactions]), TransactionModule],
  controllers: [WalletController],
  providers: [WalletService]
})
export class WalletModule {}
