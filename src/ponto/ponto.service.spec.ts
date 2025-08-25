import { Test, TestingModule } from '@nestjs/testing';
import { PontoService } from './ponto.service';
import { UtilService } from '@/util/util.service';
import { env } from '@/utils/env';
import { AuthService } from '@/auth/auth.service';
import { AuthEntity } from '@/auth/entities/auth.entity';
import { jwtDecode } from 'jwt-decode';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

describe('PontoService', () => {
  let service: PontoService;
  let serviceAuth: AuthService;

  // let auth: AuthEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PontoService, UtilService, PrismaService],
    }).compile();

    service = module.get<PontoService>(PontoService);

  }, 6_500);

  it('create', async () => {
    const inserts = await service.findByDay(auth);

    expect(Object.keys(inserts)).toEqual([
      'Entrada',
      'Almoco',
      'Retorno',
      'Saida',
      'Horas Trabalhadas',
    ]);

    const res = service.create(auth);

    if (inserts.Retorno !== '-') {
      return await expect(res).rejects.toThrow(
        'Você ainda não trabalhou 8 horas.',
      );
    }

    if (inserts.Saida !== '-') {
      return await expect(res).rejects.toThrow('Já registrou a saída.');
    }

    if (env.RECORD_HOURS === false) {
      return await expect(res).rejects.toThrow('Função desativada');
    }

    await expect(res).resolves.toBeDefined();
  }, 7_000);

  it.only('findAll', async () => {
    const res = await service.findAll({ username: env.USER_NAME });

    expect(res[0]).toHaveProperty('dia');
  });

  it('hoursRecorded', () => {
    const hours = ['09:35'];
    const res = service.hoursRecorded(hours);

    expect(Object.keys(res)).toEqual([
      'Entrada',
      'Almoco',
      'Retorno',
      'Saida',
      'Horas Trabalhadas',
    ]);
  });
});
