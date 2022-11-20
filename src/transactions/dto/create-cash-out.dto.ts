import { ApiProperty } from "@nestjs/swagger"

export class CreateCashOutDto {
    @ApiProperty()
    username: string

    @ApiProperty()
    value: number
}