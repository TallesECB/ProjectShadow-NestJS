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
import { Pagination, IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Transactions } from '../../models/transactions.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Coins)
    private readonly coinRepository: Repository<Coins>,
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>
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
    const result = await this.walletRepository.findOne(newWallet.address);
    result.created_at = newWallet.created_at;
    result.updated_at = newWallet.updated_at;
    return result;
  }

  async findOneByAddress(address: AddressDto): Promise<WalletDto> {
    const wallet = await this.walletRepository.findOne(address);
    if (!wallet || Object.keys(wallet).length === 0) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async findAll(options: IPaginationOptions, query: SearchWalletDto): Promise<Pagination<Wallet>> {
    return paginate<Wallet>(this.walletRepository, options, {
      where: query
    });
  }

  async update(address: AddressDto, updateCoinDto: CoinDto[]) {
    await this.findOneByAddress(address);
    const transactions = await Promise.all(
      updateCoinDto.map(async (updateCoinDto) => {
        const wallet = await this.coinRepository.findOne({ where: { wallet: address, coin: updateCoinDto.quoteTo } });
        if (['BTC', 'ETH'].includes(updateCoinDto.quoteTo)) {
          throw new BadRequestException(
            'Sorry but this wallet does not accept cryptocurrencies, you can convert it to EUR, USD or BRL -> Canceled Operations'
          );
        }
        const convertValue = await axios
          .get(`https://economia.awesomeapi.com.br/json/last/${updateCoinDto.currentCoin}-${updateCoinDto.quoteTo}`)
          .then((res) => res.data);
        updateCoinDto.value = convertValue[updateCoinDto.currentCoin + updateCoinDto.quoteTo].ask * updateCoinDto.value;
        //const currentCotation = convertValue[updateCoinDto.currentCoin + updateCoinDto.quoteTo].ask;
        const coinFullname = convertValue[updateCoinDto.currentCoin + updateCoinDto.quoteTo].name.split('/')[1];

        const updateCoin = {
          coin: updateCoinDto.quoteTo,
          fullname: coinFullname,
          amont: null,
          wallet: address
          /*
          transactions: [
            {
              receiveFrom: address,
              sendTo: address,
              value: updateCoinDto.value,
              currentCotation: currentCotation
            }
          ]
          */
        };
        if (!wallet) {
          if (updateCoinDto.value > 0) {
            updateCoin.amont = updateCoinDto.value;
            await this.coinRepository.create(updateCoin);
            return updateCoin;
          } else {
            throw new BadRequestException('Not enough balance');
          }
        } else {
          if (wallet.amont + updateCoinDto.value < 0) {
            throw new BadRequestException(
              `Without sufficient balance for this transaction, your current balance is ${wallet.amont} ${wallet.coin}`
            );
          }
          updateCoin.amont = wallet.amont + updateCoinDto.value;
          /*
          const transactionCoins = await this.transactionsRepository.create({
            receiveFrom: address,
            sendTo: address,
            value: updateCoinDto.value,
            currentCotation: currentCotation
          });
          updateCoin.transactions.push(transactionCoins);
          */
          return updateCoin;
        }
      })
    );
    const results = [];
    await Promise.all(
      transactions.map(async (transaction) => {
        const wallet = await this.coinRepository.findOne({ where: { wallet: address, coin: transaction.coin } });
        if (!wallet) {
          results.push(await this.coinRepository.save(transaction));
        } else {
          results.push(await this.coinRepository.update(wallet.idCoin, transaction));
        }
      })
    );
    for (const iterator of results) {
      if (iterator.affected === 1) {
        return await this.walletRepository.findOne(address);
      }
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
