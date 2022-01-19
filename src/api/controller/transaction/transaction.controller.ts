import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TransactionService } from '../../service/transaction/transaction.service';
import { Wallet } from '../../models/wallet.entity';
import { JoiPipe } from 'nestjs-joi';
import { ErrorDto } from '../../dto/error.dto';
import { AddressDto } from '../../dto/wallets/address.dto';
//import { serialize, SerializeTransactionCreate, paginatedSerializeTransaction } from '../../serialize/serializeTransactions';
import { TransactionDto } from '../../dto/transactions/transaction.dto';
import { SearchTransactionDto } from '../../dto/transactions/search-transaction.dto';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiQuery
} from '@nestjs/swagger';

@ApiTags('Transaction')
@Controller({path: '/wallet/:address/transaction', version: '1'})
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiCreatedResponse({ type: Wallet })
  @ApiNotFoundResponse({ description: 'The Wallet was not found.', type: ErrorDto, isArray: true })
  @ApiBadRequestResponse()
  create(
      @Param(JoiPipe) address: AddressDto,
      @Body(JoiPipe) createTransactionDto: TransactionDto
  ): Promise<object> {
      return this.transactionService.create(address, createTransactionDto);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  async findAll(
    @Param(JoiPipe) address: AddressDto,
    @Query('limit') limit = 100,
    @Query('page') page = 1,
    @Query(JoiPipe) query: SearchTransactionDto
  ): Promise<object> {
    const options = {
      page,
      limit
    };
    delete query.page;
    delete query.limit;
    const results = await this.transactionService.findAll(address, options, query);
    return results;
  }
}
