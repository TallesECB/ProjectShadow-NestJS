import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionDto } from '../../dto/transactions/transaction.dto';
import { SearchTransactionDto } from '../../dto/transactions/search-transaction.dto';
import { AddressDto } from 'src/api/dto/wallets/address.dto';
import { Transactions  } from '../../models/transactions.entity';;
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination, IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import * as moment from 'moment';
import { Coins } from '../../models/coins.entity';
import axios from 'axios';
import { Wallet } from '../../models/wallet.entity';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletRepository: Repository<Wallet>,
        @InjectRepository(Transactions)
        private readonly transactionsRepository: Repository<Transactions>,
        @InjectRepository(Coins)
        private readonly coinRepository: Repository<Coins>
     ) {}

  async create(address: AddressDto, createTransactionDto: TransactionDto): Promise<object> {
    console.log(address);
    console.log(createTransactionDto)
    await this.walletRepository.findOne(createTransactionDto.receiverAddress);
    if(createTransactionDto.value < 0 ) {
        throw new BadRequestException('Negative values ​​are not accepted in transfeecias');
    }
    const coinReicever = await this.coinRepository.findOne({ where: { wallet: createTransactionDto.receiverAddress, coin: createTransactionDto.quoteTo } });
    const coinFrom = await this.coinRepository.findOne({ where: { wallet: address, coin: createTransactionDto.currentCoin } });
    
    const convertValue = await axios
        .get(`https://economia.awesomeapi.com.br/json/last/${createTransactionDto.currentCoin}-${createTransactionDto.quoteTo}`)
        .then((res) => res.data);
    
    const currentCotation = convertValue[createTransactionDto.currentCoin + createTransactionDto.quoteTo].ask
    const coinFullname = convertValue[createTransactionDto.currentCoin + createTransactionDto.quoteTo].name.split('/')[1];

    //realizar a logica de await this.transactionRepository.create(transferFrom)
    const transferFrom = {
        value: -createTransactionDto.value,
        receiveFrom: address,
        datetime: moment(),
        currentCotation: currentCotation,
        coins: coinFrom.idCoin,
    }

    //realizar a logica de await this.transactionRepository.create(transferReicever)
    const transferReicever = { 
        value: createTransactionDto.value,
        receiveFrom: address,
        datetime: moment(),
        currentCotation: currentCotation,
        coins: coinReicever.idCoin,
    }
    
    const updateCoin = {
        coin: createTransactionDto.quoteTo,
        fullname: coinFullname,
        amont: null,
        wallet: address
    };

    if (!coinReicever) {
        if (createTransactionDto.value > 0) {
          updateCoin.amont = createTransactionDto.value;
          const transaction = await this.coinRepository.create(updateCoin);
          const result = await this.coinRepository.save(transaction);
        } else {
          throw new BadRequestException('Not enough balance');
        }
    } else {
        if (coinReicever.amont + createTransactionDto.value < 0) {
          throw new BadRequestException(
            `Without sufficient balance for this transaction, your current balance is ${coinReicever.amont} ${coinReicever.coin}`
          );
        }
        updateCoin.amont = coinReicever.amont + createTransactionDto.value;
        const result = await this.coinRepository.update(coinReicever.idCoin, updateCoin)
    }
    //Padronizar e criar a logica do retorno.
    const teste = {

    }
    return teste
  }
  
  async findAll(address: AddressDto, options: IPaginationOptions, query: SearchTransactionDto): Promise<Pagination<Transactions>> {
    return paginate<Transactions>(this.transactionsRepository, options, {
      where: query
    });
  }
}