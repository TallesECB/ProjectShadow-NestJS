import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../models/wallet.entity';
import * as moment from 'moment';
import { WalletDto } from '../../dto/wallets/wallet.dto';
import { SearchWalletDto } from '../../dto/wallets/search-wallet.dto';
import { AddressDto } from '../../dto/wallets/address.dto';
import { CoinDto } from '../../dto/coins/coin.dto';
import { Coins } from '../../models/coins.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Coins)
    private readonly coinRepository: Repository<Coins>
  ) {}

  async create(CreateWalletDto: WalletDto): Promise<WalletDto> {
    const newWallet = this.walletRepository.create(CreateWalletDto);
    const {cpf, birthdate, name} = newWallet
    const birthdateFormated = moment(birthdate, 'DD/MM/YYYY');
    const minAge = 18;
    const years = moment().diff(birthdateFormated, 'years', false);
    if (years < minAge) {
      throw new BadRequestException(`Wallet ${name} -> Underage must be over 18-Years!`);
    }
    const validCpf = await this.walletRepository.find({cpf})
    if(validCpf.length >= 1) {
      throw new ConflictException(`${cpf} Already in Use!`);
    }
    await this.walletRepository.save(newWallet);
    return await this.walletRepository.findOne(newWallet.address);
  }

  async findOneByAddress(address: AddressDto): Promise<WalletDto> {
    const wallet = await this.walletRepository.findOne(address);
    if (!wallet || Object.keys(wallet).length === 0) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async findAll(payload: SearchWalletDto) {
    const results = await this.walletRepository.find(payload);
    if (!results || Object.keys(results).length === 0) {
      throw new NotFoundException('Wallets not found');
    }
    return results;
  }

  async update(address: AddressDto, updateCoinDto: CoinDto) {
    const wallet = await this.coinRepository.findOne({where: {wallet: address, coin: updateCoinDto.currentCoin}});
    const updateCoin = {
      coin: updateCoinDto.currentCoin,
      fullname: "teste",
      amont: updateCoinDto.value,
      wallet: address
    }
    if(!wallet) {
      const newCoin = await this.coinRepository.create(updateCoin);
      const result = await this.coinRepository.save(newCoin) 
      return result
    } else {
      const result = await this.coinRepository.update(wallet.idCoin, updateCoin);
      return result
    }
  }

  async remove(address: AddressDto) {
    const result = await this.walletRepository.delete(address);
    if (result.affected > 0) {
      return result.raw;
    }
    throw new NotFoundException('Car not found');
  }
}
