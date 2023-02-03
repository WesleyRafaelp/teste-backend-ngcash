import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { arrayContains } from 'class-validator';
import { endOfDay, format, startOfDay } from 'date-fns';
import { th } from 'date-fns/locale';
import { join } from 'path';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { arrayBuffer } from 'stream/consumers';
import { ArrayContainedBy, Between, DataSource, Repository } from 'typeorm';
import { isPromise } from 'util/types';
import { CreateCashOutDto } from './dto/create-cash-out.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DateTransaction } from './dto/dateTransaction.dto';
import { TransactionFilterDto } from './dto/transaction-filter.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionRole } from './role/enum-role';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private usersService: UsersService,
    private accountsService: AccountsService
  ) { }

  async create(
    createCashOutDto: CreateCashOutDto,
    currentUser: User
  ) {
    const userCashOut = await this.usersService.findOneUser(currentUser.username)
    const userCashIn = await this.usersService.findOneUser(createCashOutDto.username)

    if (!userCashIn) {
      throw new BadRequestException()
    }

    await this.usersService.validateCashOut(
      currentUser,
      userCashIn.username,
      createCashOutDto.value
    );

    const createTransaction = await this.transactionRepository.create({
      debitedAccount: currentUser.account,
      creditedAccount: userCashIn.account,
      value: createCashOutDto.value
    })

    if (!createTransaction) {
      throw new BadRequestException()
    }

    const calculeteCashOut = userCashOut.account.balance - createCashOutDto.value
    const calculeteCashIn = userCashIn.account.balance + createCashOutDto.value

    await this.accountsService.update(userCashOut.id, calculeteCashOut)
    await this.accountsService.update(userCashIn.id, calculeteCashIn)

    await this.transactionRepository.save(createTransaction)

    return 'a new transaction created';
  }

  async filterTransaction(filter: TransactionFilterDto, currentUser: User) {

    const query = await this.transactionRepository.createQueryBuilder('transactions')
      .select([
        'transactions.id',
        'creditedAccount.id',
        'debitedAccount.id',
        'transactions.value',
        'transactions.createdAt'
      ])
      .innerJoin('transactions.creditedAccount', 'creditedAccount')
      .innerJoin('transactions.debitedAccount', 'debitedAccount')
      .orderBy('transactions.createdAt', 'DESC')

    if (filter.role === TransactionRole.All && filter.date) {

      const cashIn = await this.transactionRepository.find({
        select: {
          id:true,
          value:true,
          createdAt:true,
          creditedAccount:{
            id:true,
            balance:false,
            credited:false,
            debited:false
          },
          debitedAccount:{
            id:true,
            balance:false,
            credited:false,
            debited:false
          },
        },
        where: {
          creditedAccount: currentUser.account,
          createdAt:
            Between(
              startOfDay(new Date(filter.date)),
              endOfDay(new Date(filter.date))
            ),
        },
        order: {
          createdAt: 'DESC',
        },
        relations:{
          creditedAccount:true,
          debitedAccount:true
        }
      });

      const cashOut = await this.transactionRepository.find({
        select: {
          id:true,
          value:true,
          createdAt:true,
          creditedAccount:{
            id:true,
            balance:false,
          },
          debitedAccount:{
            id:true,
            balance:false,
          },
        },
        where: {
          debitedAccount: currentUser.account,
          createdAt: 
            Between(
              startOfDay(new Date(filter.date)), 
              endOfDay(new Date(filter.date))
            ),
        },
        order: {
          createdAt: 'DESC',
        },
        relations:{
          creditedAccount:true,
          debitedAccount:true
        }
      });

      return { cashIn: cashIn, cashOut: cashOut };
    }

    if (filter.role === TransactionRole.All) {
      const cashIn = await this.transactionRepository.find({
        select:{
          id:true,
          value:true,
          createdAt:true,
          creditedAccount:{
            id:true,
            balance:false,
          },
          debitedAccount:{
            id:true,
            balance:false,
          },
        },
        where: {
          creditedAccount: currentUser.account,
        },
        order: {
          createdAt: 'DESC',
        },
        relations:{
          creditedAccount:true,
          debitedAccount:true
        }
      })

      const cashOut = await this.transactionRepository.find({
        select: {
          id:true,
          value:true,
          createdAt:true,
          creditedAccount:{
            id:true,
            balance:false,
          },
          debitedAccount:{
            id:true,
            balance:false,
          },
        },
        where: {
          debitedAccount: currentUser.account
        },
        order: {
          createdAt: 'DESC',
        },
        relations:{
          creditedAccount:true,
          debitedAccount:true
        },
      })

      return { cashIn: cashIn, cashOut: cashOut }
    }

    if (filter.role === TransactionRole.CashIn) {
      query.andWhere('transactions.creditedAccount = :accountId', { accountId: currentUser.id })
    }

    if (filter.role === TransactionRole.CashOut) {
      query.andWhere('transactions.debitedAccount = :accountId', { accountId: currentUser.id })
    }

    if (filter.date) {
      query.andWhere('transactions.createdAt BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(filter.date)),
        endDate: endOfDay(new Date(filter.date))
      })
    }

    return query.getMany()
  }
}
