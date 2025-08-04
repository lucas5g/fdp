import { Test, TestingModule } from '@nestjs/testing';
import { PontoService } from './ponto.service';
import { UtilService } from '@/util/util.service';
import { env } from '@/env';
import { Cookie } from 'playwright';
import { plainToInstance } from 'class-transformer';
import { FindAllPontoDto } from '@/ponto/dto/find-all-ponto.dto';

describe('PontoService', () => {
  let service: PontoService;
  let value: string = 'D97911D5D312959AE27990DB1DD58F59'

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PontoService, UtilService],
    }).compile();

    service = module.get<PontoService>(PontoService);
    const payload = {
      username: env.USER_NAME,
      password: env.USER_PASSWORD,
    };

    // const res = await service.login(payload);

    // value = res.value

  });

  it('create', async () => {
    const inserts = await service.findByDay({ cookie });

    expect(Object.keys(inserts)).toEqual([
      'Entrada',
      'Almoco',
      'Retorno',
      'Saida',
      'Horas Trabalhadas',
    ]);
    return

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
  }, 30500);

  it.only('findAll', async () => {

    const dto = plainToInstance(FindAllPontoDto, {
      value
    });

    const res = await service.findAll(dto);

    // console.log({ res })
    return

    expect(res[0]).toHaveProperty('dia');
  }, 90_000);

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

});
