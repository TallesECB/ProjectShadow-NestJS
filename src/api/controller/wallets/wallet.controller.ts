import { Controller, Get, Post, Body, Put, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, HttpCode} from '@nestjs/common';
import { WalletService } from '../../service/wallets/wallet.service';
import { Wallet } from '../../models/wallet.entity';
import { JoiPipe } from 'nestjs-joi';
import { WalletDto } from '../../dto/wallets/wallet.dto';
import { ErrorDto } from '../../dto/error.dto';
import { SearchWalletDto } from '../../dto/wallets/search-wallet.dto';
import { ListWalletDto } from '../../dto/wallets/list-wallet.dto';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Wallets')
@Controller('/api/v1/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiCreatedResponse({ type: Wallet })
  @ApiBadRequestResponse()
  @Post()
  async create(@Body(JoiPipe) createWalletDto: WalletDto) {
    return this.walletService.create(createWalletDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Operation succeeded.', type: ListWalletDto })
  findAll(@Param() payload: SearchWalletDto) {
    return this.walletService.findAll(payload);
  }

  @Get(':address')
  @ApiOkResponse({ description: 'Operation succeeded.', type: WalletDto })
  @ApiNotFoundResponse({ description: 'The Wallet was not found.', type: ErrorDto, isArray: true })
  findOneByAddress(@Param('address') address: string) {
    return this.walletService.findOneByAddress(address);
  }

  //@Put(':address')
  //@ApiOkResponse({ description: 'Operation succeeded.', type: WalletDto })
  //@ApiNotFoundResponse({ description: 'The Wallet was not found.', type: ErrorDto, isArray: true })
  //update(@Param('address') address: number, @Body() updateWalletDto: WalletDto) {
  // return this.walletService.update(address, updateWalletDto);
  //}

  @Delete(':address')
  @ApiNoContentResponse({ description: 'Wallet removed.' })
  @ApiNotFoundResponse({ description: 'The Wallet was not found.', type: ErrorDto, isArray: true })
  @HttpCode(204)
  remove(@Param('address') address: string) {
    return this.walletService.remove(address);
  }
}
