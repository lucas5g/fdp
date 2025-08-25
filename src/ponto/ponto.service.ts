import { BadRequestException, Injectable } from '@nestjs/common';
import { add, format, parse } from 'date-fns';
import { Page } from 'playwright';
import { ptBR } from 'date-fns/locale';
import { AuthEntity } from '@/auth/entities/auth.entity';
import { Request } from 'express';
import { data } from 'cheerio/dist/commonjs/api/attributes';
import { env } from '@/utils/env';
import { PrismaService } from '@/prisma/prisma.service';
import { setupPlaywright } from '@/utils/setup-playwright';
@Injectable()
export class PontoService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }
  async create(auth: AuthEntity) {
    const { page, closeBrowser } = await setupPlaywright(auth);

    const hoursDict = await this.findHours({ page });

    if (hoursDict.Saida !== '-') {
      void closeBrowser();
      throw new BadRequestException('Já registrou a saída.');
    }

    const [hours, minutes] = hoursDict['Horas Trabalhadas']
      .split(':')
      .map(Number);
    const minutesFull = hours * 60 + minutes;

    if (hoursDict.Retorno !== '-' && minutesFull < 480) {
      void closeBrowser();
      throw new BadRequestException('Você ainda não trabalhou 8 horas.');
    }

    await page
      .locator('#iFrameArteWeb')
      .contentFrame()
      .getByRole('button', { name: 'Inserir Marcação' })
      .click();

    await page.waitForTimeout(500)
    void closeBrowser();


    return { message: 'Ponto Batido' };
  }

  async findAll(auth: AuthEntity) {
    const { page, closeBrowser } = await this.util.setupPlaywright(auth);
    await page.getByText('Controle').click();


    const selectorDateFilter =
      'input#id_datefield-mascara-jquery_2007264_2111180';

    const dateFilter = await page
      .locator(selectorDateFilter)
      .getAttribute('value');

    await page.waitForTimeout(1_200)


    const selector = 'table > tbody:nth-child(2) > tr > td:nth-child(4) > div'

    await page.waitForSelector(selector);

    const res = await page.$$eval(selector, (elements) =>
      elements.map((element) => {
        return element.textContent?.trim() ?? '';
      }),
    );

    void closeBrowser();

    const [, month, year] = dateFilter!.split('/').map(Number);

    return res
      .filter(row => row !== 'Entrada/Saída')
      .map((row, i) => {
        const day = i + 1;
        const [Entrada, Almoco, Retorno, Saida] = row.split(' ');
        const data = parse(`${day}/${month}/${year}`, 'dd/MM/yyyy', new Date());


        const dayWeek = format(data, 'E', { locale: ptBR }).toUpperCase();

        return {
          dia: String(day).padStart(2, '0'),
          diaSemana: dayWeek,
          registros:
            dayWeek === 'SÁBADO' || dayWeek === 'DOMINGO' || Entrada === ''
              ? '-'
              : {
                Entrada,
                Almoco,
                Retorno,
                Saida: Saida ?? this.util.setEnd(Entrada, Almoco, Retorno),
              },
        };
      });
  }

  async findByDay(auth: AuthEntity) {
    const { page, closeBrowser } = await this.util.setupPlaywright(auth);

    const res = await this.findHours({ page });

    void closeBrowser();
    return res;
  }

  hoursRecorded(horasList: string[]) {
    const horasChaves = {
      Entrada: horasList[0] ?? '-',
      Almoco: horasList[1] ?? '-',
      Retorno: horasList[2] ?? '-',
      Saida: horasList[3] ?? '-',
    };

    const hoursToNumber = (horasMinutos: string) => {
      const horasParaSplitar =
        horasMinutos === '-' ? format(new Date(), 'HH:mm') : horasMinutos;

      const [horas, minutos] = horasParaSplitar.split(':');
      return Number(horas) * 60 + Number(minutos);
    };

    const horasInteiro = {
      Entrada: hoursToNumber(horasChaves.Entrada),
      Almoço: hoursToNumber(horasChaves.Almoco),
      Retorno: hoursToNumber(horasChaves.Retorno),
      Saída: hoursToNumber(horasChaves.Saida),
    };

    const horasTrabalhadaInteiro =
      horasInteiro.Saída -
      horasInteiro.Entrada -
      (horasInteiro.Retorno - horasInteiro.Almoço);
    const horas = Math.floor(horasTrabalhadaInteiro / 60);
    const minutos = horasTrabalhadaInteiro % 60;

    const HorasTrabalhada = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

    return {
      ...horasChaves,
      'Horas Trabalhadas': HorasTrabalhada,
    };
  }

  private async findHours({ page }: { page: Page }) {
    await page.getByText('Marcar').click();

    await page
      .locator('#iFrameArteWeb')
      .contentFrame()
      .getByRole('heading', { name: 'Ponto web LUCAS DE SOUSA' })
      .waitFor();

    const table = await page
      .locator('#iFrameArteWeb')
      .contentFrame()
      .getByRole('table')
      .locator('tbody > tr > td')
      .allTextContents();

    const res = table.map((element) => element.trim());

    return this.hoursRecorded(res);
  }

  async generate(auth: AuthEntity) {
    // const days = await this.findAll(auth);
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        username: auth?.username,
      },
    })

    const days = [
      {
        dia: '01',
        diaSemana: 'SEXTA',
        registros: {
          Entrada: '09:05',
          Almoco: '13:52',
          Retorno: '14:54',
          Saida: '18:07',
        },
      },
      {
        dia: '02',
        diaSemana: 'SÁBADO',
        registros: '-',
      },
      {
        dia: '03',
        diaSemana: 'DOMINGO',
        registros: '-',
      },
      {
        dia: '04',
        diaSemana: 'SEGUNDA',
        registros: {
          Entrada: '09:02',
          Almoco: '12:22',
          Retorno: '13:22',
          Saida: '18:04',
        },
      },
      {
        dia: '05',
        diaSemana: 'TERÇA',
        registros: {
          Entrada: '08:56',
          Almoco: '13:20',
          Retorno: '14:20',
          Saida: '17:57',
        },
      },
      {
        dia: '06',
        diaSemana: 'QUARTA',
        registros: {
          Entrada: '09:20',
          Almoco: '13:19',
          Retorno: '14:26',
          Saida: '18:28',
        },
      },
    ];

    return {
      days,
      baseUrl: env.BASE_URL,
      user,
    };
  }
}
