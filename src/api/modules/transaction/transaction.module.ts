import { Module } from '@nestjs/common';
import { TransactionService } from '../../service/transaction/transaction.service';
import { TransactionController } from '../../controller/transaction/transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../../models/wallet.entity';
import { Coins } from '../../models/coins.entity';
import { Transactions } from '../../models/transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Coins, Transactions])],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}