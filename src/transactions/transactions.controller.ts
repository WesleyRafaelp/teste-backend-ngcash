import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import AuthUser from 'src/auth/user.decorator';
import { CreateCashOutDto } from './dto/create-cash-out.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransactionRole } from './role/enum-role';
import { Transaction } from './entities/transaction.entity';
import { DateTransaction } from './dto/dateTransaction.dto';
import { TransactionFilterDto } from './dto/transaction-filter.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  create(@Body() createCashOutDto: CreateCashOutDto, @AuthUser() currentUser: User) {
    return this.transactionsService.create(createCashOutDto, currentUser);
  }


  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({name: 'role', enum: TransactionRole})
  async filterTransaction(
    @Query() transactionFilterDto: TransactionFilterDto, 
    @AuthUser() currentUser: User
    ){
    return await this.transactionsService.filterTransaction(transactionFilterDto, currentUser);
  }
}
