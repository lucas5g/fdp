import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import axios, { AxiosError } from 'axios';
import qs from 'qs';
import { UtilService } from '@/util/util.service';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly util: UtilService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }



  async login(dto: LoginAuthDto) {

    const user = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
      },
    })

    if (!user || this.util.decrypt(user?.password ?? '') !== dto.password) {
      if (await this.hasScrapedLogin(dto)) {
        await this.prisma.user.create({
          data: {
            username: dto.username,
            password: this.util.encrypt(dto.password),
          },
        })
      }
    }


    const payload = {
      username: dto.username,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload)
    }
  }


  private async hasScrapedLogin(dto: LoginAuthDto) {
    const message = await this.loginSecurityCheck(dto);

    if (
      message.includes('Usu�rio e/ou senha inv�lidos') ||
      message.includes('Usu�rio Ldap. Login ou senha inv�lidos')
    ) {
      throw new UnauthorizedException('Usuário ou Senha Incorretos!!!');
    }



    return true;
  }

  async me(auth: AuthEntity) {
    return this.prisma.user.findUnique({
      where: {
        username: auth.username,
      },
    });
  }

  async loginSecurityCheck(dto: LoginAuthDto): Promise<string> {
    try {
      const {
        data,
      }: {
        data: string;
      } = await axios.post(
        'https://azc.defensoria.mg.def.br/azc/j_security_check',
        qs.stringify({
          j_username: dto.username,
          j_password: dto.password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          transformResponse: [],
        },
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response?.data as string;
      }
      return 'Ocorreu um erro ao fazer o login';
    }
  }

}
