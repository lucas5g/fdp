import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { version } from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    .setBaseViewsDir('./views')
    .useStaticAssets('./public')
    .setViewEngine('ejs')
    .enableCors()
  

  const config = new DocumentBuilder()
    .setTitle('Folha de Pontos')
    .setDescription('API Gestão Folha de Pontos')
    .setVersion(version)
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/doc', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);

  Logger.debug(
    `Application is running on: ${await app.getUrl()}/doc - version: ${version}`,
  );
}
void bootstrap();
