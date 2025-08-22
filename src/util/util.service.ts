import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { format } from 'date-fns';
import { chromium } from 'playwright';
import axios, { AxiosError } from 'axios';
import { env } from '@/env';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthEntity } from '@/auth/entities/auth.entity';
import crypto from "node:crypto";
import { LoginAuthDto } from '@/auth/dto/login-auth.dto';
import qs from 'qs';


enum SameSite {
  Strict = 'Strict',
  Lax = 'Lax',
  None = 'None',
}
@Injectable()
export class UtilService {
  constructor(private readonly prisma: PrismaService) { }
  async getUrlPoint(username: string) {
    const date = format(new Date(), 'yyyy-MM-dd');

    const hours = format(new Date(), 'HH:mm');

    const url = `https://azc.defensoria.mg.def.br/arte/auraarteweb?credentials=00020aarte0a${username}0aarte0alucas.assuncao${env.AZC_TOKEN}${date}%20(${hours})&relat=.F00&codigoLayout=xxxx`;

    try {
      await axios.get(url);
    } catch {
      throw new NotFoundException('Usuário não cadastrado!!!');
    }

    return url;
  }

  async setupPlaywright(auth: AuthEntity) {
    const browser = await chromium.launch({
      headless: false,
    });

    const context = await browser.newContext();

    const page = await context.newPage();
    const closeBrowser = async () => {
      await context.close();
      await browser.close();
    };

    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        username: auth?.username,
      },
    });

    const password = this.decrypt(user.password ?? '');


    await page.goto('https://azc.defensoria.mg.def.br/azc');
    await page.waitForSelector('p.titulo');
    await page.locator('#cod_usuario').fill(auth.username);
    await page.locator('#senha').fill(password);
    await page.locator('#senha').press('Enter');
    await page.waitForSelector('#idLabelRazaoEmpresaSelecionada');
    await page
      .getByRole('row', { name: 'Minha Frequência' })
      .getByRole('img')
      .nth(1)
      .click();


    return {
      page,
      closeBrowser,
      context,
    };
  }

  async loginSecurityCheck(dto: LoginAuthDto): Promise<string> {
    try {
      const {
        data,

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
        },
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const cookie = error.response?.headers['set-cookie']?.[0] ?? '';
        return cookie.split(/=|;/g)[1]

      }
      return 'Ocorreu um erro ao fazer o login';
    }
  }




  encrypt(plainText: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", env.SECRET_KEY, iv);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  }
  decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-cbc", env.SECRET_KEY, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  setEnd(start: string, lunchStart: string, lunchEnd: string) {
    const [hourStart, minuteStart] = start.split(':');
    const [hourLunchStart, minuteLunchStart] = lunchStart.split(':');
    const [hourLunchEnd, minuteLunchEnd] = lunchEnd.split(':');

    const startNumber = Number(hourStart) * 60 + Number(minuteStart);
    const lunchStartNumber = Number(hourLunchStart) * 60 + Number(minuteLunchStart);
    const lunchEndNumber = Number(hourLunchEnd) * 60 + Number(minuteLunchEnd);

    const heightHour = 480

    const endNumber = startNumber + (lunchEndNumber - lunchStartNumber) + heightHour


    const hours = Math.floor(endNumber / 60);
    const minutes = endNumber % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }


}
