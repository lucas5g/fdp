import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { env } from '@/utils/env';
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
      providers: [AuthService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);

    const res = await service.login({
      username: env.USER_NAME,
      password: env.USER_PASSWORD,
    });
    expect(res).toHaveLength(143)

    expect(res).toBe

  }, 5500);

  it('me', async () => {
    const res = await service.me({ username: env.USER_NAME } as AuthEntity);

    const properties = [
      'username',
      'masp'
    ]

    for (const property of properties) {
      expect(res).toHaveProperty(property)
    }
  });

  it('loginSecurityCheck', async () => {
    const res = await service.loginSecurityCheck({
      username: env.USER_NAME,
      password: env.USER_PASSWORD,
    });

    expect(res).toBe
  })
});
