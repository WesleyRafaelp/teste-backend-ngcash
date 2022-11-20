import NumericTransformer from "src/common/transform/numeric";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({ type: 'decimal', transformer: NumericTransformer})
    balance: number

    @OneToMany(() => Transaction, (transaction) => transaction.debitedAccount)
    debited: Transaction[]

    @OneToMany(() => Transaction, (transaction) => transaction.creditedAccount)
    credited: Transaction[]
}

