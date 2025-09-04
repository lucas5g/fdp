import { Test, TestingModule } from '@nestjs/testing';
import { PointService } from './point.service';
import { env } from '@/utils/env';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

describe('PointService', () => {
  let service: PointService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointService, PrismaService, UserService],
    }).compile();

    service = module.get<PointService>(PointService);
  }, 6_500);

  it('findByDay', async () => {
    const res = await service.findByDay({ username: env.USER_NAME! });

    expect(Object.keys(res)).toEqual([
      'start',
      'lunch',
      'lunchEnd',
      'end',
      'hoursWorked',
    ]);
  }, 5500);

  it('findAll', async () => {
    const res = await service.findAll({ username: env.USER_NAME! });

    expect(res).toBeDefined();

    for (const row of res) {
      expect(row).toHaveProperty('day');
      expect(row.registers).not.toEqual('-lunch');
    }

    expect(res[0]).toHaveProperty('day');
  }, 6_000);

  it('hoursRecorded', () => {
    const hours = ['09:27', '12:13', '13:13'];
    const res = service.hoursRecorded(hours);

    expect(Object.keys(res)).toEqual([
      'start',
      'lunch',
      'lunchEnd',
      'end',
      'hoursWorked',
    ]);
  });

  it('generate', async () => {
    const res = await service.generate({ username: env.USER_NAME! });

    expect(res).toHaveProperty('user');
  });
});
