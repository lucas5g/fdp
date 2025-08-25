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

  it('encrypt and decrypt', () => {
    const text = 'test-123'
    const res = service.encrypt(text);

    const decrypted = service.decrypt(res);

    expect(res).toHaveLength(65)
    expect(decrypted).toContain(text)

  })

  it.only('setHourEnd', () => {
    const res = service.setEnd('09:00', '12:00', '13:02')

    expect(res).toBe('18:02')

  })
});
