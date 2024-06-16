import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'
import { JwtConfigService } from '@/lib/_service/configs/jwt-config.service';
import { UsersModule } from '@/users/users.module';
import { RefreshTokenModule } from '@/refresh-token/refresh-token.module';

@Module({
  imports: [UsersModule, RefreshTokenModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }

