import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;

  let id: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);

    const payload = plainToInstance(CreateUserDto, {
      username: 'lucas.sousa',
      password: '123456',
    });

    const res = await service.create(payload);

    id = res.id;
  });

  afterAll(async () => {
    await service.remove(id);
  });

  it('findOne', async () => {
    const res = await service.findOne(id);

    expect(res).toHaveProperty('username', 'lucas.sousa');
  });

  it('update', async () => {
    const payload: UpdateUserDto = {
      username: 'lucas.sousa',
      password: '123456',
      name: 'Lucas de Teste',
      masp: '123456789',
      signature: Buffer.from('public/assinatura.png'),
    };

    const res = await service.update(id, payload);

    expect(res).not.toHaveProperty('password');
  });
});
