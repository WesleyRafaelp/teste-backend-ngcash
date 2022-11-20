import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { TransactionRole } from "../role/enum-role"

export class TransactionFilterDto {
    @ApiPropertyOptional({type: Date})
    date?: Date

    @ApiProperty()
    role?: TransactionRole
}