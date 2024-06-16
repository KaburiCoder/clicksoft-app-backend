import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { SignupDto } from '@/api/auth/dto/sign-up.dto';

export let app: INestApplication;
export let mongod: MongoMemoryServer;

export const setupTestEnvironment = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = await mongod.getUri();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      MongooseModule.forRoot(uri),
      AppModule,
    ],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
};

export const teardownTestEnvironment = async () => {
  await app.close();
  await mongod.stop();
};

