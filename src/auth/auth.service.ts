import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './passport/jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    private userService:UsersService,
   private jwtService:JwtService
  ){
  }
 async validateUser(email:string,password:string) {
    try {
      const user = await this.userService.findOneByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user; // Password matches
        } else {
            return null;
        }
     
      
    } catch (error) {
            throw new HttpException(error.message,error.code);
    }
  }

    async login(user: any) {
    const payload = { name: user.name, sub: user.userId,role:user.role };
      const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: jwtConstants.expirationTime,
            secret: jwtConstants.secret,
        });

  
        return { message: "Login successful", access_token }
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
