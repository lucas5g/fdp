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

  it('findByUsername', async () => {
    const res = await service.findByUsername('lucas.assuncao')

    expect(Object.keys(res)).toEqual(['Entrada', 'Almoco', 'Retorno', 'Saida', 'HorasTrabalhada'])

  });

  it.only('findByUsernameFormadao', async () => {
    const res = await service.findByusernameFormat('lucasdesousa3885')

    expect(res).toContain('**Horas trabalhada**:')

  });
});
