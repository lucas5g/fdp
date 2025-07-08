import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { format } from 'date-fns';
import { chromium } from 'playwright';
import axios from 'axios';
import { env } from '@/env';

@Injectable()
export class UtilService {
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

  async setupPlaywright(data: {
    username: string;
    password?: string;

  }) {
    const browser = await chromium.launch({
      // headless: false,
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    const closeBrowser = async () => {
      await context.close();
      await browser.close();
    };

    await page.goto('https://azc.defensoria.mg.def.br');

    await page.locator('#cod_usuario').fill(data.username);
    await page.locator('#senha').fill(data.password!);
    await page.locator('#senha').press('Enter');

    const selector = '#idLabelRazaoEmpresaSelecionada';
    await page.waitForTimeout(1300);
    const exist = await page.$(selector);

    if (!exist) {
      void closeBrowser();
      throw new UnauthorizedException('Usuário e Senha Incorretos!!!');
    }

    return {
      page,
      closeBrowser,
    };
  }
}
