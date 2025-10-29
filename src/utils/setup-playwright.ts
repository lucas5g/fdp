import { chromium } from 'playwright';
import { AuthEntity } from '@/auth/entities/auth.entity';
import { decrypt } from '@/utils/decrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function setupPlaywright(auth: AuthEntity) {
  const browser = await chromium.launch({
    // headless: false,
  });

  const context = await browser.newContext({
    // userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
    // ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  const user = await prisma.user.findFirstOrThrow({
    where: {
      username: auth?.username,
    },
  });

  const password = decrypt(user.password ?? '');

  await page.goto('https://azc.defensoria.mg.def.br/azc');

  await page.waitForSelector('p.titulo');
  await page.locator('#cod_usuario').fill(auth.username);
  await page.locator('#senha').fill(password);
  await page.locator('#senha').press('Enter');
  await page.waitForSelector('#idLabelRazaoEmpresaSelecionada');
  await page
    .getByRole('row', { name: 'Minha Frequência' })
    .getByRole('img')
    .nth(1)
    .click();

  const closeBrowser = async () => {
    await context.close();
    await browser.close();
  };

  return {
    page,
    closeBrowser,
    context,
  };
}
