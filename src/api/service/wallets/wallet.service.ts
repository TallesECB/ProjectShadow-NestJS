import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../models/wallet.entity';

import { WalletDto } from '../../dto/wallets/wallet.dto';
import { SearchWalletDto } from '../../dto/wallets/search-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>
  ) {}

  async create(CreateWalletDto: WalletDto): Promise<WalletDto> {
    const newWallet = await this.walletRepository.create(CreateWalletDto)
    await this.walletRepository.save(newWallet);
    return await this.walletRepository.findOne(newWallet.address);
  }

  async findOneByAddress(address: string): Promise<WalletDto> {
    const wallet = await this.walletRepository.findOne(address)
    if(!wallet || Object.keys(wallet).length === 0) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async findAll(payload: SearchWalletDto) {
    const results = await this.walletRepository.find(payload);
    if(!results || Object.keys(results).length === 0) {
      throw new NotFoundException('Wallets not found');
    }
    return results;
  }

  async remove(address: string){
    const result = await this.walletRepository.delete(address);
    if (result.affected > 0) {
      return result.raw;
    }
    throw new NotFoundException('Car not found');
  }
}
