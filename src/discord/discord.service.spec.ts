import { Test, TestingModule } from '@nestjs/testing';
import { DiscordService } from './discord.service';

describe('DiscordService', () => {
  let service: DiscordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordService],
    }).compile();

    service = module.get<DiscordService>(DiscordService);
  });

  it('create', async () => {
    const res = await service.create();

    expect(res).toBe
  });
});
