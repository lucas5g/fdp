import { Test, TestingModule } from '@nestjs/testing';
import { UtilService } from './util.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('UtilService', () => {
  let service: UtilService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilService, PrismaService],
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

  it.only('encrypt', () => {
    const res = service.encrypt('test-123');
    console.log(res);
    expect(res).toHaveLength(65)
    // expect(res).toEqual('321776bc81752b33f29aa32cc3048342:456a485f7148fa77fdfb99de1329707c')
    // console.log(res);
  })

  it.only('decrypt', async() => {
    const res =  service.decrypt('321776bc81752b33f29aa32cc3048342:456a485f7148fa77fdfb99de1329707c');
    expect(res).toEqual('test-123')
  })
});
