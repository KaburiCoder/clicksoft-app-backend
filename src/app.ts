import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/configs/cors.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


export async function RunApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.useStaticAssets(path.join(__dirname, "..", "public"), { prefix: "/" });

  app.enableCors(corsConfig)
  await app.listen(3000);
}

export async function RunGrpcServer() {
  // 2. gRPC 서버 실행
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'webAppUser',
      protoPath: path.join(__dirname, 'shared/proto/web-app-user.proto'),
      url: '0.0.0.0:5000',      
    },    
  });

  // gRPC 서버 실행을 대기
  await grpcApp.listen();
  console.log('gRPC server is running on 0.0.0.0:5000');
}