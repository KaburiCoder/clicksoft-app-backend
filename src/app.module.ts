import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IntermediaryModule } from './socket/intermediary/intermediary.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [IntermediaryModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
