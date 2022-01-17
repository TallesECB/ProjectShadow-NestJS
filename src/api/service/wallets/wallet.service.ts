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
import axios from 'axios';

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
    const { cpf, birthdate, name } = newWallet;
    const birthdateFormated = moment(birthdate, 'DD/MM/YYYY');
    const minAge = 18;
    const years = moment().diff(birthdateFormated, 'years', false);
    if (years < minAge) {
      throw new BadRequestException(`Wallet ${name} -> Underage must be over 18-Years!`);
    }
    const validCpf = await this.walletRepository.find({ cpf });
    if (validCpf.length >= 1) {
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
    await this.findOneByAddress(address);

    const wallet = await this.coinRepository.findOne({ where: { wallet: address, coin: updateCoinDto.quoteTo } });

    if (updateCoinDto.quoteTo === 'BTC' || updateCoinDto.quoteTo === 'ETH') {
      throw new BadRequestException(
        'Sorry but this wallet does not accept cryptocurrencies, you can convert it to EUR, USD or BRL'
      );
    }

    const convertValue = await axios
      .get(`https://economia.awesomeapi.com.br/json/last/${updateCoinDto.currentCoin}-${updateCoinDto.quoteTo}`)
      .then((res) => res.data);
    updateCoinDto.value = convertValue[updateCoinDto.currentCoin + updateCoinDto.quoteTo].ask * updateCoinDto.value;
    const coinFullname = convertValue[updateCoinDto.currentCoin + updateCoinDto.quoteTo].name.split('/')[1];

    if (!wallet) {
      if (updateCoinDto.value > 0) {
        const addingCoin = {
          coin: updateCoinDto.quoteTo,
          fullname: coinFullname,
          amont: updateCoinDto.value,
          wallet: address
        };
        const newCoin = await this.coinRepository.create(addingCoin);
        const result = await this.coinRepository.save(newCoin);
        return result;
      } else {
        throw new BadRequestException('Not enough balance');
      }
    } else {
      const updateCoin = {
        coin: updateCoinDto.quoteTo,
        fullname: coinFullname,
        amont: wallet.amont + updateCoinDto.value,
        wallet: address
      };

      if (updateCoin.amont < 0) {
        throw new BadRequestException(
          `Without sufficient balance for this transaction, your current balance is ${wallet.amont} ${wallet.coin}`
        );
      }
      const result = await this.coinRepository.update(wallet.idCoin, updateCoin);
      return result;
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
