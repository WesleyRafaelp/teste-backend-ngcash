import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/users/dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.validateUser(loginDto);
    }
}
