import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { UtilService } from '@/util/util.service';
import { format, parse } from 'date-fns';
import { FindAllPontoDto } from '@/ponto/dto/find-all-ponto.dto';
import { Page } from 'playwright';
import { ptBR } from 'date-fns/locale';
@Injectable()
export class PontoService {
  constructor(private readonly util: UtilService) {}
  async create(dto: CreatePontoDto) {
    const { page, closeBrowser } = await this.util.setupPlaywright(dto);

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

    void closeBrowser();

    return { message: 'Ponto Batido' };
  }

  async findAll(dto: FindAllPontoDto) {
    const { page, closeBrowser } = await this.util.setupPlaywright(dto);

    await page.goto('https://azc.defensoria.mg.def.br');

    await page.waitForTimeout(1_700);

    const selectorDateFilter =
      'input#id_datefield-mascara-jquery_2007264_2111180';

    const dateFilter = await page
      .locator(selectorDateFilter)
      .getAttribute('value');

    const selector =
      '#x-widget-50 > div > div > div.GB2UA-DDDUB > div.GB2UA-DDOSB > table > tbody:nth-child(2) > tr > td:nth-child(4) > div';

    await page.waitForSelector(selector);

    const res = await page.$$eval(selector, (elements) =>
      elements.map((element) => {
        return element.textContent?.trim() ?? '';
      }),
    );

    void closeBrowser();

    const [, month, year] = dateFilter!.split('/').map(Number);

    return res.map((row, i) => {
      const day = i + 1;
      const [Entrada, Almoco, Retorno, Saida] = row.split(' ');
      const data = parse(`${day}/${month}/${year}`, 'dd/MM/yyyy', new Date());

      const dayWeek = format(data, 'E', { locale: ptBR }).toUpperCase();

      return {
        dia: String(day).padStart(2, '0'),
        diaSemana: dayWeek,
        registros:
          dayWeek === 'SÁBADO' || dayWeek === 'DOMINGO'
            ? '-'
            : {
                Entrada,
                Almoco,
                Retorno,
                Saida,
              },
      };
    });
  }

  async findByDay(dto: FindAllPontoDto) {
    const { page, closeBrowser } = await this.util.setupPlaywright(dto);

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
    await page.goto('https://azc.defensoria.mg.def.br/azc');
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
}
