import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/users/dto/login.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.validateUser(loginDto);
    }
}
