import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { format } from 'date-fns';
import { chromium, Cookie } from 'playwright';
import axios from 'axios';
import { env } from '@/env';
import { PrismaService } from '@/prisma/prisma.service';

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

  async setupPlaywright(cookie?: Cookie) {
    const browser = await chromium.launch({
      // headless: false,
    });

    const context = await browser.newContext();

    const page = await context.newPage();
    const closeBrowser = async () => {
      await context.close();
      await browser.close();
    };

    if (cookie) {
      console.log({ cookie })
      await context.addCookies([cookie]);
      await page.goto('https://azc.defensoria.mg.def.br');

      const selector = '#txtBoasVindas';
      const exist = await page.$(selector);

      // await this.prisma.user.update({
      //   where: {
      //     value: cookie.value,
      //   },
      //   data:{
      //     value: cookie.value
      //   }
      // });

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

}
