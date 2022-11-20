import { ApiProperty } from "@nestjs/swagger";
import { Account } from "src/accounts/entities/account.entity";

export class CreateTransactionDto {
    debitedAccount: Account;

    @ApiProperty({name: 'username'})
    creditedAccount: Account;

    @ApiProperty()
    value: number;

    createdAt: string;
}
