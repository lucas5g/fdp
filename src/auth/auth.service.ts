import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import axios, { AxiosError } from 'axios';
import qs from 'qs';
import { UtilService } from '@/util/util.service';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly util: UtilService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async login(dto: CreateAuthDto) {
    const message = await this.loginSecurityCheck(dto);

    if (
      message.includes('Usu�rio e/ou senha inv�lidos') ||
      message.includes('Usu�rio Ldap. Login ou senha inv�lidos')
    ) {
      throw new UnauthorizedException('Usuário ou Senha Incorretos!!!');
    }

    const { page, context, closeBrowser } = await this.util.setupPlaywright();

    await page.goto('https://azc.defensoria.mg.def.br');

    await page.locator('#cod_usuario').fill(dto.username);
    await page.locator('#senha').fill(dto.password);
    await page.locator('#senha').press('Enter');

    const cookies = await context.cookies();

    await page.waitForSelector('#idLabelRazaoEmpresaSelecionada');
    await page
      .getByRole('row', { name: 'Minha Frequência' })
      .getByRole('img')
      .nth(1)
      .click();
    await page.getByText('Controle').click();
    await page.waitForSelector('h1#tituloForm');

    await closeBrowser();

    await this.prisma.user.update({
      where: {
        username: dto.username,
      },
      data: {
        value: cookies[0].value,
        
      },
    });

    const payload = {
      username: dto.username,
      value: cookies[0].value,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async me(auth: AuthEntity) {
    return this.prisma.user.findUnique({
      where: {
        username: auth.username,
      },
    });
  }

  async loginSecurityCheck(dto: CreateAuthDto): Promise<string> {
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
