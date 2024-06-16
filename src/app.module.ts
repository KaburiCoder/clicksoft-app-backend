import { MiddlewareConsumer, Module, NestModule, UnauthorizedException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IntermediaryModule } from './socket/intermediary/intermediary.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './api/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './lib/filters/all-exceptions-filter';
import { MongooseConfigService } from './lib/_service/configs/mongoose-config.service';
import { EnvModule } from './lib/_module/env.module';
import { UsersModule } from './users/users.module';
import { CurrentUserMiddleware } from './lib/middlewares/current-user.middleware';
import { JwtConfigService } from './lib/_service/configs/jwt-config.service';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import * as cookieParser from 'cookie-parser'
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${process.env.NODE_ENV}`, }),
    JwtModule.registerAsync({ useClass: JwtConfigService, global: true }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }), AuthModule, IntermediaryModule, EnvModule, UsersModule, RefreshTokenModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedException,
    },
    AppService
  ],
  // exports: [EnvService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*')
  }
}
