import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import AuthUser from 'src/auth/user.decorator';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

 
  @Get()
  findAll(){
    return this.usersService.findAll()
  }

  @Get('user/:id')
  findUser(@Param('id') id: string){
    return this.usersService.findOne(id)
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);

  }

  @Get('/account')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findOneAccount(@AuthUser() currentUser: User) {
    return this.usersService.findOneAccount(currentUser);
  }
 
  @Patch()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  update(@AuthUser() currentUser: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(currentUser, updateUserDto);
  }

}
