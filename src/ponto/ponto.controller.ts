import { Controller, Get, Post, Render, Req } from '@nestjs/common';
import { PontoService } from './ponto.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthEntity } from '@/auth/entities/auth.entity';
import { Public } from '@/auth/decorators/public.decorator';
import { Request } from 'express';
@ApiBearerAuth()
@Controller('pontos')
export class PontoController {
  constructor(private readonly pontoService: PontoService) { }

  @Post()
  create(@Auth() auth: AuthEntity) {
    return this.pontoService.create(auth);
  }

  @Get('mes')
  findAll(@Auth() auth: AuthEntity) {
    return this.pontoService.findAll(auth);
  }

  @Get('dia')
  findByDay(@Auth() auth: AuthEntity) {
    return this.pontoService.findByDay(auth);
  }

  @Get('gerar')
  @Render('index')
  generate(@Req() req: Request) {
    return this.pontoService.generate(req);
  }

  @Get('test')
  @Public()
  test(@Req() req: Request) {
    return [
      {
        "dia": "01",
        "diaSemana": "SEXTA",
        "registros": {
          "Entrada": "09:05",
          "Almoco": "13:52",
          "Retorno": "14:54",
          "Saida": "18:07"
        }
      },
      {
        "dia": "02",
        "diaSemana": "SÁBADO",
        "registros": "-"
      },
      {
        "dia": "03",
        "diaSemana": "DOMINGO",
        "registros": "-"
      },
      {
        "dia": "04",
        "diaSemana": "SEGUNDA",
        "registros": {
          "Entrada": "09:02",
          "Almoco": "12:22",
          "Retorno": "13:22",
          "Saida": "18:04"
        }
      },
      {
        "dia": "05",
        "diaSemana": "TERÇA",
        "registros": {
          "Entrada": "08:56",
          "Almoco": "13:20",
          "Retorno": "14:20",
          "Saida": "17:57"
        }
      },
      {
        "dia": "06",
        "diaSemana": "QUARTA",
        "registros": {
          "Entrada": "09:20",
          "Almoco": "13:19",
          "Retorno": "14:26",
          "Saida": "18:28"
        }
      },
      {
        "dia": "07",
        "diaSemana": "QUINTA",
        "registros": {
          "Entrada": "09:13",
          "Almoco": "12:21",
          "Retorno": "13:37",
          "Saida": "18:40"
        }
      },
      {
        "dia": "08",
        "diaSemana": "SEXTA",
        "registros": {
          "Entrada": "09:10",
          "Almoco": "12:47",
          "Retorno": "13:48",
          "Saida": "18:17"
        }
      },
      {
        "dia": "09",
        "diaSemana": "SÁBADO",
        "registros": "-"
      },
      {
        "dia": "10",
        "diaSemana": "DOMINGO",
        "registros": "-"
      },
      {
        "dia": "11",
        "diaSemana": "SEGUNDA",
        "registros": {
          "Entrada": "09:35",
          "Almoco": "13:06",
          "Retorno": "14:08"
        }
      }
    ]
  }
}
