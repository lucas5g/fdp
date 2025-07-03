import { Test, TestingModule } from '@nestjs/testing';
import { PontoService } from './ponto.service';
import { UtilService } from '@/util/util.service';

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

    if (inserts.Saida !== '-') {
      return await expect(res).rejects.toThrow('Já registrou a saída.');
    }

    console.log(res);
  }, 7000);

  it('findByUsernameFormadao', async () => {
    const res = await service.findByusernameFormat('lucas.assuncao');

    expect(res).toContain('**Horas trabalhada**:');
  });

  it('findAll', async () => {
    const res = await service.findAll();

    expect(res[0]).toHaveProperty('dia');
  }, 6000);
});
