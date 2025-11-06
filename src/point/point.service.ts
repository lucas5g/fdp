import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { format, parse } from 'date-fns';
import { Page } from 'playwright';
import { ptBR } from 'date-fns/locale';
import { AuthEntity } from '@/auth/entities/auth.entity';
import { setupPlaywright } from '@/utils/setup-playwright';
import { UserService } from '@/user/user.service';
import { setEnd } from '@/utils/set-end';
import { getDayDetail } from '@/utils/get-day-detail';
import { env } from '@/utils/env';
import { PrismaService } from '@/prisma/prisma.service';
import { startDay } from '@/utils/startDay';
import { EIGHT_HOURS_WORKED } from '@/utils/contants';
import { getHoursWorked } from '@/utils/get-hours-worked';
@Injectable()
export class PointService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}
  async create(auth: AuthEntity) {
    const { page, closeBrowser } = await setupPlaywright(auth);

    const pointToday = await this.prisma.point.findUnique({
      where: {
        userId_date: {
          userId: auth.id,
          date: startDay(),
        },
      },
      select: {
        start: true,
        lunchStart: true,
        lunchEnd: true,
        end: true,
      },
    });

    if (pointToday?.end) {
      void closeBrowser();
      throw new BadRequestException('Já registrou a saída.');
    }

    const hoursWorked = pointToday ? getHoursWorked(pointToday) : '00:00';

    if (pointToday?.lunchEnd && hoursWorked < EIGHT_HOURS_WORKED) {
      void closeBrowser();
      throw new BadRequestException('Você ainda não trabalhou 8 horas.');
    }

    if (env.RECORD_HOURS) {
      await page
        .locator('#iFrameArteWeb')
        .contentFrame()
        .getByRole('button', { name: 'Inserir Marcação' })
        .click();
    } else {
      Logger.debug('Record hours is disabled. Skipping point recording.');
    }

    const hours = await this.findHours({ page });

    void closeBrowser();

    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        username: auth.username,
      },
      select: {
        id: true,
      },
    });

    const point = await this.prisma.point.upsert({
      where: {
        userId_date: {
          date: startDay(),
          userId: user.id,
        },
      },
      create: {
        ...hours,
        userId: user.id,
        date: startDay(),
      },
      update: hours,
    });

    return {
      ...point,
      hoursWorked: getHoursWorked(hours),
    };
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
          let [start] = row.split(' ');
          const [, lunch, lunchEnd, end] = row.split(' ');
          const data = parse(
            `${day}/${month}/${year}`,
            'dd/MM/yyyy',
            new Date(),
          );
          const dayWeek = format(data, 'E', { locale: ptBR }).toUpperCase();

          start = String(day) === '21' ? '09:00' : start;

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
                    lunch: lunch || '12:00',
                    lunchEnd: lunchEnd || '13:00',
                    end: end ?? setEnd(start, lunch, lunchEnd),
                  },
          };
        })
    );
  }

  async findByDay(auth: AuthEntity) {
    const point = await this.prisma.point.findUnique({
      where: {
        userId_date: {
          userId: auth.id,
          date: startDay(),
        },
      },
    });

    return {
      ...point,
      hoursWorked: point ? getHoursWorked(point) : '00:00',
    };
  }

  async refreshDay(auth: AuthEntity) {
    const { page, closeBrowser } = await setupPlaywright(auth);

    const hours = await this.findHours({ page });
    void closeBrowser();

    return this.prisma.point.upsert({
      where: {
        userId_date: {
          userId: auth.id,
          date: startDay(),
        },
      },
      create: {
        ...hours,
        userId: auth.id,
        date: startDay(),
      },
      update: {
        ...hours,
      },
    });
  }

  hoursRecorded(hoursList: string[]) {
    const start = hoursList[0];
    const lunchStart = hoursList[1];
    const lunchEnd = hoursList[2];
    const end = hoursList[3];

    return {
      start,
      lunchStart,
      lunchEnd,
      end,
    };
  }

  private async findHours({ page }: { page: Page }) {
    await page.waitForTimeout(1_000);
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
