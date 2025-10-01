import { BadRequestException, Injectable } from '@nestjs/common';
import { format, parse } from 'date-fns';
import { Page } from 'playwright';
import { ptBR } from 'date-fns/locale';
import { AuthEntity } from '@/auth/entities/auth.entity';
import { setupPlaywright } from '@/utils/setup-playwright';
import { UserService } from '@/user/user.service';
import { setEnd } from '@/utils/set-end';
import { getDayDetail } from '@/utils/get-day-detail';
@Injectable()
export class PointService {
  constructor(private readonly userService: UserService) {}
  async create(auth: AuthEntity) {
    const { page, closeBrowser } = await setupPlaywright(auth);

    const hoursDict = await this.findHours({ page });

    if (hoursDict.end !== '-') {
      void closeBrowser();
      throw new BadRequestException('Já registrou a saída.');
    }

    const [hours, minutes] = hoursDict.hoursWorked.split(':').map(Number);
    const minutesFull = hours * 60 + minutes;

    if (hoursDict.lunchEnd !== '-' && minutesFull < 480) {
      void closeBrowser();
      throw new BadRequestException('Você ainda não trabalhou 8 horas.');
    }

    await page
      .locator('#iFrameArteWeb')
      .contentFrame()
      .getByRole('button', { name: 'Inserir Marcação' })
      .click();

    await page.waitForTimeout(500);
    void closeBrowser();

    return { message: 'Ponto Batido' };
  }

  async findAll(auth: AuthEntity) {
    const { page, closeBrowser } = await setupPlaywright(auth);
    await page.getByText('Controle').click();

    await page.waitForTimeout(1_100);

    const selectorDateFilter =
      'input#id_datefield-mascara-jquery_2007264_2111180';

    const dateFilter = await page
      .locator(selectorDateFilter)
      .getAttribute('value');

    const selector = 'table > tbody:nth-child(2) > tr > td:nth-child(4) > div';

    await page.waitForSelector(selector);

    const res = await page.$$eval(selector, (elements) =>
      elements.map((element) => {
        return element.textContent?.trim() ?? '';
      }),
    );

    void closeBrowser();

    const [, month, year] = dateFilter!.split('/').map(Number);

    return (
      res
        // .filter(row => row !== 'start/Saída')
        .slice(1)
        .map((row, i) => {
          const day = i + 1;
          const [start, lunch, lunchEnd, end] = row.split(' ');
          const data = parse(
            `${day}/${month}/${year}`,
            'dd/MM/yyyy',
            new Date(),
          );
          const dayWeek = format(data, 'E', { locale: ptBR }).toUpperCase();

          return {
            day: String(day).padStart(2, '0'),
            dayName: dayWeek,
            month: format(new Date(year, month - 1), 'MMMM', {
              locale: ptBR,
            }).toUpperCase(),
            details: getDayDetail(dayWeek, start),
            registers:
              dayWeek === 'SÁBADO' || dayWeek === 'DOMINGO' || start === ''
                ? '-'
                : {
                    start,
                    lunch,
                    lunchEnd,
                    end: end ?? setEnd(start, lunch, lunchEnd),
                  },
          };
        })
    );
  }

  async findByDay(auth: AuthEntity) {
    const { page, closeBrowser } = await setupPlaywright(auth);

    const res = await this.findHours({ page });

    void closeBrowser();
    return res;
  }

  hoursRecorded(hoursList: string[]) {
    const start = hoursList[0] ?? '-';
    const lunch = hoursList[1] ?? '-';
    const lunchEnd = hoursList[2] ?? '-';
    const end = hoursList[3] ?? '-';

    const hoursToNumber = (hoursMinutes: string) => {
      const hoursSplit =
        hoursMinutes === '-' ? format(new Date(), 'HH:mm') : hoursMinutes;

      const [hour, minute] = hoursSplit.split(':');
      return Number(hour) * 60 + Number(minute);
    };

    const startNumber = hoursToNumber(start);
    const lunchStartNumber = hoursToNumber(lunch);
    const lunchEndNumber = hoursToNumber(lunchEnd);
    const endNumber = hoursToNumber(end);

    const hoursWorkedNumber =
      lunchStartNumber - startNumber + (endNumber - lunchEndNumber);

    const hours = Math.floor(hoursWorkedNumber / 60);
    const minutes = hoursWorkedNumber % 60;

    const hoursWorked = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    return {
      start,
      lunch,
      lunchEnd,
      end,
      hoursWorked,
    };
  }

  private async findHours({ page }: { page: Page }) {
    await page.getByText('Marcar').click();

    await page
      .locator('#iFrameArteWeb')
      .contentFrame()
      .getByRole('heading', { name: 'Ponto web' })
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

  async generateTest(auth: AuthEntity) {
    const user = await this.userService.findOneWhere({
      username: auth?.username,
    });

    const days = [
      {
        day: '01',
        dayName: 'SEXTA',
        registers: {
          start: '09:05',
          lunch: '13:52',
          lunchEnd: '14:54',
          end: '18:07',
        },
      },
      {
        day: '02',
        dayName: 'SÁBADO',
        registers: '-',
      },
      {
        day: '03',
        dayName: 'DOMINGO',
        registers: '-',
      },
      {
        day: '04',
        dayName: 'SEGUNDA',
        registers: {
          start: '09:02',
          lunch: '12:22',
          lunchEnd: '13:22',
          end: '18:04',
        },
      },
      {
        day: '05',
        dayName: 'TERÇA',
        registers: {
          start: '08:56',
          lunch: '13:20',
          lunchEnd: '14:20',
          end: '17:57',
        },
      },
      {
        day: '06',
        dayName: 'QUARTA',
        registers: {
          start: '09:20',
          lunch: '13:19',
          lunchEnd: '14:26',
          end: '18:28',
        },
      },
    ];

    return {
      user,
      days,
    };
  }

  async generate(auth: AuthEntity) {
    const [user, days] = await Promise.all([
      this.userService.findOneWhere({
        username: auth?.username,
      }),
      this.findAll(auth),
    ]);

    return {
      user,
      days,
    };
  }
}
