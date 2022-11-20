import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Account } from 'src/accounts/entities/account.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { ApiBadRequestResponse } from '@nestjs/swagger';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private accountsService: AccountsService
  ){}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: createUserDto.username
      }
    })

    if (user){
      throw new HttpException(`User already registered!`, HttpStatus.CONFLICT);
    }

    const validatePassword = createUserDto.password.match(/(?=.*[A-Z].*)(?=.*\d.*)/gm)

    if(!validatePassword) {
      throw new HttpException('precisa ao menos uma letra maiúscula e um número', HttpStatus.BAD_REQUEST)
    }
    
    const createUser = this.userRepository.create({username: createUserDto.username, password: createUserDto.password})

    const saveUser = await this.userRepository.save(createUser)
    
    if (createUser) {
      const account = await this.accountsService.create()
      
      await this.userRepository.save({...createUser, account})
    }

    return 'user created'
  }

  findOneAccount(currentUser: User) {
    return this.userRepository.findOne({select:['id','username','account'], where:{username: currentUser.username}});
  }

  findAll(){
    const user = this.userRepository.find()
    return user
  }

  async findOneUser(username: string) {
    const user = this.userRepository.findOne({where:{username:username}})

    if(!user) {
      throw new UnauthorizedException('not authorized')
    }
    return user
  }



  async validateCashOut(currentUser:User, userNameCashIn:string, value:number) {
    const userCashOut = await this.userRepository.findOne({where:{username:currentUser.username}})
    const userCashIn = await this.userRepository.findOne({where:{username: userNameCashIn}})

    if(userCashOut.username === userNameCashIn) {
      throw new ConflictException()
    }

    if(userCashOut.account.balance <= 0) {
      throw new BadRequestException('Saldo insuficiente!!!')
    }

    if(value > userCashOut.account.balance) {
      throw new BadRequestException('Saldo insuficiente!!!')
    }

    if(value <= 0) {
      throw new BadRequestException()
    }
    
    return
  }

  async update(currentUser: User, updateUserDto:UpdateUserDto){
    const user = await this.userRepository.findOne({where:{username:currentUser.username}})
     
    console.log(user)

    const userDataBase = await this.userRepository.findOne({where:{ username: updateUserDto.username}})

    if(!user) {
      throw new BadRequestException()
    }

    if(userDataBase){
      throw new ConflictException('usuário já existe')
    }

    const validatePassword = updateUserDto.password.match(/(?=.*[A-Z].*)(?=.*\d.*)/gm)

    if(!validatePassword) {
      throw new HttpException('precisa ao menos uma letra maiúscula e um número', HttpStatus.BAD_REQUEST)
    }
    
   const up = await this.userRepository.save({...user, ...updateUserDto})

    console.log(up)

    return 'usuario atualizado'

  }
}
