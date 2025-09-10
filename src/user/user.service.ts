import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly omit: Prisma.UserOmit = {
    signature: true,
    password: true,
  };
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      omit: this.omit,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      omit: this.omit,
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      omit: this.omit,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
      omit: this.omit,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id,
      },
      omit: this.omit,
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
        masp: true,
      },
    });
  }

  async findOneSignature(id: number) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        signature: true,
      },
    });

    return user.signature;
  }
}
