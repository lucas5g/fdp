import { Test, TestingModule } from '@nestjs/testing';
import { PontoService } from './ponto.service';
import { UtilService } from '@/util/util.service';
import { env } from '@/env';
import { plainToInstance } from 'class-transformer';
import { FindAllPontoDto } from '@/ponto/dto/find-all-ponto.dto';
import { AuthService } from '@/auth/auth.service';

describe('PontoService', () => {
  let service: PontoService;
  let serviceAuth: AuthService;

  let dto: FindAllPontoDto;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PontoService, UtilService],
    }).compile();

    const moduleAuth: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UtilService],
    }).compile();

    service = module.get<PontoService>(PontoService);
    serviceAuth = moduleAuth.get<AuthService>(AuthService);

    const res = await serviceAuth.login({
      username: env.USER_NAME,
      password: env.USER_PASSWORD,
    });

    dto = plainToInstance(FindAllPontoDto, {
      value: res.value,
    });
  }, 6_500);

  it('create', async () => {
    const inserts = await service.findByDay(dto);

    expect(Object.keys(inserts)).toEqual([
      'Entrada',
      'Almoco',
      'Retorno',
      'Saida',
      'Horas Trabalhadas',
    ]);

    const res = service.create(dto);

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

  it('findAll', async () => {
    const res = await service.findAll(dto);

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
