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

  it('create', async () => {
    const res = await service.create({
      username: env.USER_NAME!,
      id: env.USER_ID!,
    });
    expect(res.hoursWorked).toBeDefined();
  });

  it('findByDay', async () => {
    const res = await service.findByDay({
      username: env.USER_NAME!,
      id: env.USER_ID!,
    });

    const properties = [
      'start',
      'lunchStart',
      'lunchEnd',
      'end',
      'hoursWorked',
    ];

    for (const property of properties) {
      expect(res).toHaveProperty(property);
    }
  });

  it('refreshDay', async () => {
    const res = await service.refreshDay({
      username: env.USER_NAME!,
      id: env.USER_ID!,
    });

    expect(res).toBeDefined();
  }, 5500);

  it.only('findAll', async () => {
    const res = await service.findAll({ username: env.USER_NAME!, id: env.USER_ID! });

    console.log(res);
    return
    expect(res).toBeDefined();

    for (const row of res) {
      expect(row).toHaveProperty('day');
      expect(row.registers).not.toEqual('-lunch');
    }

    expect(res[0]).toHaveProperty('day');
  }, 6_000);
});
