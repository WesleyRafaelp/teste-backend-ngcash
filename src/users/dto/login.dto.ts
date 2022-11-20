import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsString()
    @Length(3, 30)
    username: string;

    @ApiProperty()
    @IsString()
    @Length(8, 30)
    password: string
}