import { ApiProperty } from "@nestjs/swagger";
import { Account } from "src/accounts/entities/account.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";


@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Account, (account) => account.debited)
    debitedAccount: Account

    @ManyToOne(() => Account, (account) => account.credited)
    creditedAccount: Account

    @Column()
    value: number

    @CreateDateColumn()
    createdAt: Date
}
