import { ApiProperty } from "@nestjs/swagger";

export class DateTransaction {
    @ApiProperty({default: '00/00/0000'})
    date: string
}