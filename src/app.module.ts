import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/entities/transaction.entity';
import { Account } from './accounts/entities/account.entity';
import { User } from './users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),    
  TypeOrmModule.forRoot({
    type: 'postgres',
      host: process.env.POSTGRES_HOST, 
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
          Account, Transaction, User
      ],
      synchronize: true,
      logger: 'debug'
  }),UsersModule, AccountsModule, TransactionsModule, JwtModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
