import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  //  @SkipA
   async login(@Request() req:any,@Res({ passthrough: true }) res){
  const token = await this.authService.login(req.user);
  res.cookie('access_token', token.access_token, {
    httpOnly: true,   // 🔒 prevents JS access (XSS protection)
    secure: true,     // use true in production (HTTPS)
    sameSite: 'strict',
  });

  return { message: 'Logged in' };
   }
   
  

   
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
function SkipAuthGuard(): (target: AuthController, propertyKey: "findOne", descriptor: TypedPropertyDescriptor<(id: string) => string>) => void | TypedPropertyDescriptor<(id: string) => string> {
  throw new Error('Function not implemented.');
}

