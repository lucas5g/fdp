import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { env } from '@/utils/env';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: env.JWT_SECRET,
        }),
      ],
      providers: [AuthService, UserService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);

    const res = await service.login({
      username: env.USER_NAME!,
      password: env.USER_PASSWORD!,
    });
    expect(res).toHaveLength(143);
  });

  it('me', async () => {
    const res = await service.me({ username: env.USER_NAME } as AuthEntity);

    const properties = ['username', 'masp'];

    for (const property of properties) {
      expect(res).toHaveProperty(property);
    }

    expect(res).not.toHaveProperty('password');
  });

  it('loginSecurityCheck', async () => {
    const res = await service.loginSecurityCheck({
      username: env.USER_NAME!,
      password: env.USER_PASSWORD!,
    });

    expect(res).toHaveLength(32);
  });

  it('login with wrong password', async () => {
    const res = service.login({
      username: env.USER_NAME!,
      password: 'wrong-password',
    });

    await expect(res).rejects.toThrow('Usuário ou Senha Incorretos!!!');
  });

  it('login user not exist', async () => {
    const res = service.login({
      username: 'wrong-user',
      password: 'wrong-password',
    });

    await expect(res).rejects.toThrow('Usuário ou Senha Incorretos!!!');
  });
});
