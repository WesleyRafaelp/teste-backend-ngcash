import { Account } from "src/accounts/entities/account.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import cryptoTransform from "../user.password-crypto";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    username: string

    @Column({transformer: cryptoTransform})
    password: string

    @OneToOne(() => Account, {eager: true})
    @JoinColumn()
    account: Account;
}
