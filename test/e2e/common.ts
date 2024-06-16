import { SignupDto } from "@/api/auth/dto/sign-up.dto";
import { app } from "./setup";
import * as request from 'supertest'

export const testSignup = async () => {
  const response = await request(app.getHttpServer())
    .post('/api2/auth/signup')
    .send({ email: "test@test.com", password: "1234" } satisfies SignupDto)
    .expect(201);

  return response.body;
}

export const testSignin = async () => {
  const response = await request(app.getHttpServer())
    .post('/api2/auth/signin')
    .send({ email: "test@test.com", password: "1234" } satisfies SignupDto)
    .expect(200);

  const cookies = response.headers['set-cookie']?.[0];
  
  return { data: response.body, cookies };
}