import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      omit: {
        password: true
      }
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      omit: {
        password: true
      }
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id
      },
      omit: {
        password: true
      }
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id
      },
      data: updateUserDto,
      omit: {
        password: true
      }
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id
      },
      omit: {
        password: true
      }
    });
  }

  findOneWhere(where: Prisma.UserWhereUniqueInput, showPassword = false) {
    return this.prisma.user.findUnique({
      where,
      select: {
        id: true,
        username: true,
        password: showPassword,
        name: true,
        signature: true,
        masp: true,
      }

    });
  }
}
