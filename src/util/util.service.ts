import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { format } from 'date-fns';
import { chromium } from 'playwright';
import axios from 'axios';
import { env } from '@/env';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthEntity } from '@/auth/entities/auth.entity';
import crypto from "node:crypto";


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

  async setupPlaywright(auth?: AuthEntity) {
    const browser = await chromium.launch({
      // headless: false,
    });

    const context = await browser.newContext();

    const page = await context.newPage();
    const closeBrowser = async () => {
      await context.close();
      await browser.close();
    };

    if (auth) {
      const cookie = {
        name: 'JSESSIONID',
        domain: 'azc.defensoria.mg.def.br',
        path: '/azc',
        expires: -1,
        httpOnly: true,
        secure: false,
        sameSite: SameSite.Lax,
        value: auth.value,
      };

      await context.addCookies([cookie]);
      await page.goto('https://azc.defensoria.mg.def.br');

      const selector = '#txtBoasVindas';
      const exist = await page.$(selector);

      if (exist) {
        void closeBrowser();
        throw new UnauthorizedException('Faça login!!!');
      }
    }

    return {
      page,
      closeBrowser,
      context,
    };
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

}
