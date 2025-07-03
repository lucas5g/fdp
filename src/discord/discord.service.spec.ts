import { Test, TestingModule } from '@nestjs/testing';
import { DiscordService } from './discord.service';
import { UtilService } from '@/util/util.service';
import { PontoService } from '@/ponto/ponto.service';

describe('DiscordService', () => {
  let service: DiscordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordService, UtilService, PontoService],
    }).compile();

    service = module.get<DiscordService>(DiscordService);
  });

  it('create', async () => {
    const res = await service.create();

    expect(res).toBe;
  });
});
