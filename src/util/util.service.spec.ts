import { Test, TestingModule } from '@nestjs/testing';
import { UtilService } from './util.service';

describe('UtilService', () => {
  let service: UtilService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilService],
    }).compile();

    service = module.get<UtilService>(UtilService);
  });

  it('getUrlPoint', async () => {
    const res = await service.getUrlPoint('lucas.assuncao');

    expect(res).toContain('https://');
  });

  it('getUrlPoint user not exist', async () => {
    const res = service.getUrlPoint('lucas.sousa');

    await expect(res).rejects.toThrow('Usuário não cadastrado!!!');
  });
});
