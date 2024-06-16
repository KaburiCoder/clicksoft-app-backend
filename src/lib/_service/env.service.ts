import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) { }

  get JWT_SECRET(): string {
    return this.configService.get<string>('JWT_SECRET')!;
  }
}