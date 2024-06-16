import * as request from 'supertest';
import { SignupDto } from 'src/api/auth/dto/sign-up.dto';
import { app } from './e2e/setup';
import { testSignin, testSignup } from './e2e/common';
import { User } from '@/db/mongo-schema/user.schema';

describe('/api2/auth (e2e)', () => {
  beforeEach(async () => {

  });

  it('/signup (POST)', async () => {
    const data = await testSignup();

    console.log(data);
  });

  it("/signin (POST)", async () => {
    await testSignup();
    const { data } = await testSignin();
    console.log(data);
  })

  it("/singout (POST)", async () => {
    await testSignup();
    const { data } = await testSignin();
    console.log(data);
  })

  it("/currentuser (POST)", async () => {
    await testSignup();
    const { cookies } = await testSignin();

    const response = await request(app.getHttpServer())
      .post('/api2/auth/currentuser')
      .set("Cookie", cookies)
      .expect(200);

    const currentUser: User = response.body;
    expect(currentUser).toBeDefined();
    expect(currentUser.email).toEqual("test@test.com");
  })
});
