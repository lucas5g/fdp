import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { UpdatePontoDto } from './dto/update-ponto.dto';
import { UtilService } from '@/util/util.service';
import * as cheerio from 'cheerio'
import axios from 'axios';
import { chromium, Page } from 'playwright';
import { format } from 'date-fns';
@Injectable()
export class PontoService {

  constructor(private readonly util: UtilService) { }
  create(createPontoDto: CreatePontoDto) {
    let page:Page


    return 'This action adds a new ponto';
  }

  async findAll() {

    const browser = await chromium.launch({
      headless: false
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://azc.defensoria.mg.def.br');

    await page.locator('#cod_usuario').fill('lucas.assuncao');
    await page.locator('#senha').fill('Dpmg@7c8');
    await page.locator('#senha').press('Enter');

    await page.getByRole('row', { name: 'Minha Frequência' }).getByRole('img').nth(1).click();
    await page.getByText('Controle').click();

    const selector = '#x-widget-50 > div > div > div.GB2UA-DDDUB > div.GB2UA-DDOSB > table > tbody:nth-child(2) > tr > td:nth-child(4)'


    // ---------------------
    await page.waitForTimeout(30000)
    await context.close();
    await browser.close();


    return `This action returns all ponto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ponto`;
  }

  async findByUsername(username: string) {
    try {

      const browser = await chromium.launch({
        // headless: false
      });
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(this.util.getUrlPoint(username));

      const seletor = 'tbody > tr > td'

      await page.waitForSelector(seletor)

      const res = await page.$$eval(seletor, (elements) => elements.map((element) => element.textContent?.trim() ?? ''));

      const [Entrada, Almoco, Retorno, Saida] = res

      await context.close();
      await browser.close();

      const horas = {
        Entrada: Entrada ?? '-',
        Almoco: Almoco ?? '-',
        Retorno: Retorno ?? '-',
        Saida: Saida ?? '-'
      }


      return {
        ...horas,
        HorasTrabalhada: this.calcularHorasTrabalhada(horas)
      }
    } catch {
      throw new NotFoundException('Usuário não cadastrado.')
    }
  }

  async findByusernameFormat(username: string) {

    const res = await this.findByUsername(username)

    return `Entrada: ${res.Entrada} \nAlmoco: ${res.Almoco} \nRetorno: ${res.Retorno} \nSaida: ${res.Saida} \n\n**Horas trabalhada**: ${res.HorasTrabalhada}`

  }

  private calcularHorasTrabalhada(horasChaves: { Entrada: string, Almoco: string, Retorno: string, Saida: string }) {

    const horasStringParaNumero = (horasMinutos: string) => {

      const horasParaSplitar = horasMinutos === '-' ? format(new Date(), 'HH:mm') : horasMinutos

      const [horas, minutos] = horasParaSplitar.split(':')
      return Number(horas) * 60 + Number(minutos)
    }

    const horasInteiro = {
      Entrada: horasStringParaNumero(horasChaves.Entrada),
      Almoco: horasStringParaNumero(horasChaves.Almoco),
      Retorno: horasStringParaNumero(horasChaves.Retorno),
      Saida: horasStringParaNumero(horasChaves.Saida)
    }

    const horasTrabalhadaInteiro = horasInteiro.Saida - horasInteiro.Entrada - (horasInteiro.Retorno - horasInteiro.Almoco)
    const horas = Math.floor(horasTrabalhadaInteiro / 60);
    const minutos = horasTrabalhadaInteiro % 60;

    const horasTrabalhada = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

    return horasTrabalhada;
  }
}
