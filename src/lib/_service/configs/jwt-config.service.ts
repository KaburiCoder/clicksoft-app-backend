import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { EnvService } from '../env.service';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly env: EnvService) { }

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    };
  }
}