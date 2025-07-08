import { Test, TestingModule } from '@nestjs/testing';
import { PontoService } from './ponto.service';
import { UtilService } from '@/util/util.service';
import { env } from '@/env';

describe('PontoService', () => {
  let service: PontoService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PontoService, UtilService],
    }).compile();

    service = module.get<PontoService>(PontoService);
  });

  it('create', async () => {
    const inserts = await service.findByDay({
      username: env.USER_NAME,
      password: env.USER_PASSWORD,
    });
    expect(Object.keys(inserts)).toEqual([
      'Entrada',
      'Almoco',
      'Retorno',
      'Saida',
      'HorasTrabalhada',
    ]);

    const res = service.create({
      username: env.USER_NAME,
      password: env.USER_PASSWORD,
    });

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
  }, 7000);

  it('findAll', async () => {
    const res = await service.findAll({
      username: env.USER_NAME,
      password: env.USER_PASSWORD,
    });

    expect(res[0]).toHaveProperty('dia');
  }, 6000);

  it('hoursRecorded', () => {
    const hours = ['09:35'];
    const res = service.hoursRecorded(hours);

    expect(Object.keys(res)).toEqual([
      'Entrada',
      'Almoco',
      'Retorno',
      'Saida',
      'HorasTrabalhada',
    ]);
  });

  // it('findByDay', async () => {
  //   const payload = {
  //     username: env.USER_NAME,
  //     password: env.USER_PASSWORD,
  //   };

  //   const res = await service.findByDay(payload);

  // });
});
