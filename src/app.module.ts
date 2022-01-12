import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { WalletModule } from './api/modules/wallets/wallet.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), WalletModule]
})
export class AppModule {}
