import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { UpdatePontoDto } from './dto/update-ponto.dto';
import { UtilService } from '@/util/util.service';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { chromium, Page } from 'playwright';
import { format } from 'date-fns';
@Injectable()
export class PontoService {
  constructor(private readonly util: UtilService) {}
  async create(createPontoDto: CreatePontoDto) {
    const { Saida, Retorno, HorasTrabalhada } = await this.findByUsername(
      createPontoDto.username,
    );

    if (Saida !== '-') {
      throw new BadRequestException('Já registrou a saída');
    }

    const [hours, minutes] = HorasTrabalhada.split(':');
    const minutesFull = Number(hours) * 60 + Number(minutes);

    if (Retorno !== '-' && minutesFull < 480) {
      throw new BadRequestException('Você ainda não trabalhou 8 horas.');
    }

    const { browser, context, page } = await this.util.setupPlaywright();

    return 'teste';
  }

  async findAll() {
    const { browser, context, page } = await this.util.setupPlaywright();

    await page
      .getByRole('row', { name: 'Minha Frequência' })
      .getByRole('img')
      .nth(1)
      .click();
    await page.getByText('Controle').click();

    const selector =
      '#x-widget-50 > div > div > div.GB2UA-DDDUB > div.GB2UA-DDOSB > table > tbody:nth-child(2) > tr > td:nth-child(4) > div';

    await page.waitForSelector(selector);

    const res = await page.$$eval(selector, (elements) =>
      elements.map((element) => {
        return element.textContent?.trim() ?? '';
      }),
    );

    await context.close();
    await browser.close();

    return res.map((row, i) => {
      const [Entrada, Almoco, Retorno, Saida] = row.split(' ');
      return {
        dia: String(i + 1).padStart(2, '0'),
        registros: {
          Entrada,
          Almoco,
          Retorno,
          Saida,
        },
      };
    });
  }

  async findByUsername(username: string) {
    try {
      const url = this.util.getUrlPoint(username);

      const { browser, context, page } = await this.util.setupPlaywright(url);

      await page.goto(this.util.getUrlPoint(username));

      const seletor = 'tbody > tr > td';

      await page.waitForSelector(seletor);

      const res = await page.$$eval(seletor, (elements) =>
        elements.map((element) => element.textContent?.trim() ?? ''),
      );

      const [Entrada, Almoco, Retorno, Saida] = res;

      await context.close();
      await browser.close();

      const horas = {
        Entrada: Entrada ?? '-',
        Almoco: Almoco ?? '-',
        Retorno: Retorno ?? '-',
        Saida: Saida ?? '-',
      };

      return {
        ...horas,
        HorasTrabalhada: this.calcularHorasTrabalhada(horas),
      };
    } catch {
      throw new NotFoundException('Usuário não cadastrado.');
    }
  }

  async findByusernameFormat(username: string) {
    const res = await this.findByUsername(username);

    return `Entrada: ${res.Entrada} \nAlmoco: ${res.Almoco} \nRetorno: ${res.Retorno} \nSaida: ${res.Saida} \n\n**Horas trabalhada**: ${res.HorasTrabalhada}`;
  }

  private calcularHorasTrabalhada(horasChaves: {
    Entrada: string;
    Almoco: string;
    Retorno: string;
    Saida: string;
  }) {
    const horasStringParaNumero = (horasMinutos: string) => {
      const horasParaSplitar =
        horasMinutos === '-' ? format(new Date(), 'HH:mm') : horasMinutos;

      const [horas, minutos] = horasParaSplitar.split(':');
      return Number(horas) * 60 + Number(minutos);
    };

    const horasInteiro = {
      Entrada: horasStringParaNumero(horasChaves.Entrada),
      Almoco: horasStringParaNumero(horasChaves.Almoco),
      Retorno: horasStringParaNumero(horasChaves.Retorno),
      Saida: horasStringParaNumero(horasChaves.Saida),
    };

    const horasTrabalhadaInteiro =
      horasInteiro.Saida -
      horasInteiro.Entrada -
      (horasInteiro.Retorno - horasInteiro.Almoco);
    const horas = Math.floor(horasTrabalhadaInteiro / 60);
    const minutos = horasTrabalhadaInteiro % 60;

    const horasTrabalhada = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

    return horasTrabalhada;
  }
}
