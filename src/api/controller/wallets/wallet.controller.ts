import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { WalletService } from '../../service/wallets/wallet.service';
import { Wallet } from '../../models/wallet.entity';
import { JoiPipe } from 'nestjs-joi';
import { WalletDto } from '../../dto/wallets/wallet.dto';
import { ErrorDto } from '../../dto/error.dto';
import { SearchWalletDto } from '../../dto/wallets/search-wallet.dto';
import { AddressDto } from '../../dto/wallets/address.dto';
import { CoinDto } from '../../dto/coins/coin.dto';
import { serialize, SerializeWalletCreate, paginatedSerializeWallet } from '../../serialize/serializeWallet';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiQuery
} from '@nestjs/swagger';

@ApiTags('Wallets')
@Controller({ path: '/wallet/', version: '1' })
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiCreatedResponse({ type: Wallet })
  @ApiBadRequestResponse()
  @Post()
  async create(@Body(JoiPipe) createWalletDto: WalletDto) {
    const result = await this.walletService.create(createWalletDto);
    return SerializeWalletCreate(result);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  async findAll(
    @Query('limit') limit = 100,
    @Query('page') page = 1,
    @Query(JoiPipe) query: SearchWalletDto
  ): Promise<object> {
    const options = {
      page,
      limit
    };
    delete query.page;
    delete query.limit;
    const results = await this.walletService.findAll(options, query);
    return paginatedSerializeWallet(results);
  }

  @Get(':address')
  @ApiOkResponse({ description: 'Operation succeeded.', type: WalletDto })
  @ApiNotFoundResponse({ description: 'The Wallet was not found.', type: ErrorDto, isArray: true })
  async findOneByAddress(@Param(JoiPipe) address: AddressDto) {
    const result = await this.walletService.findOneByAddress(address);
    return serialize(result);
  }

  @Put(':address')
  update(@Param(JoiPipe) address: AddressDto, @Body(JoiPipe) updateCoinDto: CoinDto[]) {
    return this.walletService.update(address, updateCoinDto);
  }

  @Delete(':address')
  @ApiNoContentResponse({ description: 'Wallet removed.' })
  @ApiNotFoundResponse({ description: 'The Wallet was not found.', type: ErrorDto, isArray: true })
  @HttpCode(204)
  remove(@Param(JoiPipe) address: AddressDto) {
    return this.walletService.remove(address);
  }
}
