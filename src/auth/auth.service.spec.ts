import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UtilService } from '@/util/util.service';
import { env } from '@/env';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: env.JWT_SECRET,
        }),
      ],
      providers: [AuthService, UtilService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);

    const res = await service.login({
      username: env.USER_NAME,
      password: env.USER_PASSWORD,
    });

    expect(res).toBe
    // console.log(res);

    // token = res.accessToken;
  }, 5500);

  it('me', async () => {
    // const res = await service.me({ username: env.USER_NAME } as AuthEntity);

    // expect(res).toMatchObject({
    //   username: env.USER_NAME,
    // });
  });

  it.only('loginSecurityCheck', async () => {
    const res = await service.loginSecurityCheck({
      username: env.USER_NAME,
      password: env.USER_PASSWORD,
    });

    expect(res).toBe
    console.log(res);
  })
});
