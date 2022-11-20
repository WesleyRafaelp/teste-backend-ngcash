import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/users/dto/login.dto';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ){}

    async validateUser(login: LoginDto): Promise<any> {
        const user = await this.usersService.findOneUser(login.username);
        
        const verifyPassword = bcrypt.compareSync(login.password, user.password);

        if(!verifyPassword) {
            throw new UnauthorizedException('not authorized')
        }

        const token = await this.sign(user)

        return {token};
    }

    async sign(user: User) {
        const payload = { username: user.username, sub: user.id, id: user.id}
        // const userValidate = await this.validateUser(user.username, user.password)
        return this.jwtService.signAsync(payload, {privateKey: 'secret', expiresIn: '24h'})

    }
}
