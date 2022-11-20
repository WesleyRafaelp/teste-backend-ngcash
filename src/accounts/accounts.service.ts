import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MAX } from 'class-validator';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ){}

  async create() {
    const createAccount = this.accountRepository.create({
      balance: 100
    });

    return await this.accountRepository.save(createAccount);
  }

  async update(id: number, balance: number) {
    const account = await this.accountRepository.findOne({where: {
      id: id
    }})

    await this.accountRepository.update(account, {balance: balance})
    
    return
  }
}
