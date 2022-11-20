import { ApiProperty } from "@nestjs/swagger";
import { Contains, IsString, Length, validate } from "class-validator";
import { Account } from "src/accounts/entities/account.entity";


export class CreateUserDto {
    
    @ApiProperty()
    @IsString()
    @Length(3, 30)
    username: string;
    
    @ApiProperty()
    @IsString()
    @Length(8, 30)
    password: string;

    account: Account;
}
