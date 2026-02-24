import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './passport/jwt.constants';

@Module({
  imports:[UsersModule,PassportModule,JwtModule.register({
    secret:jwtConstants.secret!,
    // signOptions:{expiresIn:jwtConstants.expirationTime }
  })
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy],
})
export class AuthModule {}
