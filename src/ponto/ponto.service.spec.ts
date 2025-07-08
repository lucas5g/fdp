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
    const inserts = await service.findByUsername('lucas.assuncao');

    const res = service.create({ username: 'lucas.assuncao' });

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

  it('findByUsernameFormadao', async () => {
    const res = await service.findByusernameFormat('lucas.assuncao');

    expect(res).toContain('**Horas trabalhada**:');
  });

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

  it.only('findByDay', async () => {
    const payload = {
      username: env.USER_NAME,
      password: env.USER_PASSWORD,
    };
    

    const res = await service.findByDay(payload);

    console.log(res);

    // await expect(res).rejects.toThrow('Hoje não teve ponto registrado.');
  }, 170000);
});
