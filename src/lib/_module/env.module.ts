import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvService } from '../_service/env.service';

@Global()
@Module({
  providers: [ConfigService, EnvService],
  exports: [EnvService],
})
export class EnvModule {}