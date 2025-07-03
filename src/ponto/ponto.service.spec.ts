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

  it.only('create', async () => {
    const res = service.create({ username: 'lucas.assuncao' })  

    await expect(res).rejects.toThrow('Você ainda não trabalhou 8 horas.')
  })
  it('findByUsername', async () => {
    const res = await service.findByUsername('lucas.assuncao')

    expect(Object.keys(res)).toEqual(['Entrada', 'Almoco', 'Retorno', 'Saida', 'HorasTrabalhada'])

  });

  it('findByUsernameFormadao', async () => {
    const res = await service.findByusernameFormat('lucasdesousa3885')

    expect(res).toContain('**Horas trabalhada**:')

  });

  it('findAll', async () => {
    const res = await service.findAll()

    expect(res).toHaveProperty('01')

  });


});
