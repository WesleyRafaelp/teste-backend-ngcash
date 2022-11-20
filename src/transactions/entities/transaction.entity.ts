import { ApiProperty } from "@nestjs/swagger";
import { Account } from "src/accounts/entities/account.entity";
import NumericTransformer from "src/common/transform/numeric";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";


@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Account, (account) => account.debited)
    debitedAccount: Account

    @ManyToOne(() => Account, (account) => account.credited)
    creditedAccount: Account

    @Column({ type: 'decimal', transformer: NumericTransformer})
    value: number

    @CreateDateColumn()
    createdAt: Date
}
