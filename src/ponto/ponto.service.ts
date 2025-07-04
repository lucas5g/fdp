import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { UtilService } from '@/util/util.service';
import { format } from 'date-fns';
import { FindAllPontoDto } from '@/ponto/dto/find-all-ponto.dto';
import { env } from '@/env';
@Injectable()
export class PontoService {
  constructor(private readonly util: UtilService) {}
  async create(createPontoDto: CreatePontoDto) {
    const { page, closeBrowser } = await this.util.setupPlaywright({
      username: createPontoDto.username,
    });

    const selectorHours = 'tbody > tr > td';

    await page.waitForSelector(selectorHours);

    const res = await page.$$eval(selectorHours, (elements) =>
      elements.map((element) => element.textContent?.trim() ?? ''),
    );

    const { Retorno, Saida, HorasTrabalhada } = this.hoursRecorded(res);

    if (Saida !== '-') {
      throw new BadRequestException('Já registrou a saída.');
    }

    const [hours, minutes] = HorasTrabalhada.split(':');
    const minutesFull = Number(hours) * 60 + Number(minutes);

    if (Retorno !== '-' && minutesFull < 480) {
      void closeBrowser();
      throw new BadRequestException('Você ainda não trabalhou 8 horas.');
    }

    if (!env.RECORD_HOURS) {
      void closeBrowser();
      throw new BadRequestException('Função desativada');
    }

    const selector = 'input#btRelogio';

    await page.waitForSelector(selector);
    await page.locator(selector).click();

    void closeBrowser();

    return { message: 'Ponto Batido' };
  }

  async findAll(dto: FindAllPontoDto) {
    const { page, closeBrowser } = await this.util.setupPlaywright({
      username: dto.username,
      password: dto.password,
      haveLogin: true,
    });

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

    void closeBrowser();

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
    const { page, closeBrowser } = await this.util.setupPlaywright({
      username: username,
    });

    const seletor = 'tbody > tr > td';

    const exist = await page.$(seletor);

    if (!exist) {
      void closeBrowser();
      throw new NotFoundException('Hoje não teve ponto registrado.');
    }

    const res = await page.$$eval(seletor, (elements) =>
      elements.map((element) => element.textContent?.trim() ?? ''),
    );

    void closeBrowser();

    return this.hoursRecorded(res);
  }

  async findByusernameFormat(username: string) {
    const res = await this.findByUsername(username);

    return `Entrada: ${res.Entrada} \nAlmoco: ${res.Almoco} \nRetorno: ${res.Retorno} \nSaida: ${res.Saida} \n\n**Horas trabalhada**: ${res.HorasTrabalhada}`;
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
      Almoco: hoursToNumber(horasChaves.Almoco),
      Retorno: hoursToNumber(horasChaves.Retorno),
      Saida: hoursToNumber(horasChaves.Saida),
    };

    const horasTrabalhadaInteiro =
      horasInteiro.Saida -
      horasInteiro.Entrada -
      (horasInteiro.Retorno - horasInteiro.Almoco);
    const horas = Math.floor(horasTrabalhadaInteiro / 60);
    const minutos = horasTrabalhadaInteiro % 60;

    const HorasTrabalhada = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

    return {
      ...horasChaves,
      HorasTrabalhada,
    };
  }
}
