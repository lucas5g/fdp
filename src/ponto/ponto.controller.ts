import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { PontoService } from './ponto.service';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { FindAllPontoDto } from '@/ponto/dto/find-all-ponto.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { LoginPontoDto } from './dto/login-ponto.dto';

@Controller('pontos')
export class PontoController {
  constructor(private readonly pontoService: PontoService) { }

  @Post()
  @ApiBody({ type: CreatePontoDto })
  create(@Body() createPontoDto: CreatePontoDto) {
    return this.pontoService.create(createPontoDto);
  }


  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/x-www-form-urlencoded') // <- ESSENCIAL
  login(@Body() dto: LoginPontoDto) {
    return this.pontoService.login(dto);
  }

  @Get('mes')
  findAll(@Query() query: FindAllPontoDto) {
    return this.pontoService.findAll(query);
  }

  @Get('dia')
  findByDay(@Query() dto: CreatePontoDto) {
    return this.pontoService.findByDay(dto);
  }

  @Get('test')
  test() {
    return [
      {
        "dia": "01",
        "diaSemana": "TERÇA",
        "registros": {
          "Entrada": "09:42",
          "Almoco": "11:59",
          "Retorno": "12:52",
          "Saida": "18:57"
        }
      },
      {
        "dia": "02",
        "diaSemana": "QUARTA",
        "registros": {
          "Entrada": "08:52",
          "Almoco": "11:51",
          "Retorno": "12:52",
          "Saida": "17:54"
        }
      },
      {
        "dia": "03",
        "diaSemana": "QUINTA",
        "registros": {
          "Entrada": "08:51",
          "Almoco": "11:54",
          "Retorno": "13:32",
          "Saida": "18:55"
        }
      },
      {
        "dia": "04",
        "diaSemana": "SEXTA",
        "registros": {
          "Entrada": "09:35",
          "Almoco": "10:16",
          "Retorno": "11:16",
          "Saida": "18:41"
        }
      },
      {
        "dia": "05",
        "diaSemana": "SÁBADO",
        "registros": "-"
      },
      {
        "dia": "06",
        "diaSemana": "DOMINGO",
        "registros": "-"
      },
      {
        "dia": "07",
        "diaSemana": "SEGUNDA",
        "registros": {
          "Entrada": "09:30",
          "Almoco": "13:22",
          "Retorno": "14:23",
          "Saida": "18:45"
        }
      },
      {
        "dia": "08",
        "diaSemana": "TERÇA",
        "registros": {
          "Entrada": "09:52",
          "Almoco": "11:59",
          "Retorno": "13:42",
          "Saida": "19:42"
        }
      },
      {
        "dia": "09",
        "diaSemana": "QUARTA",
        "registros": {
          "Entrada": "09:17",
          "Almoco": "11:59",
          "Retorno": "12:58",
          "Saida": "18:30"
        }
      },
      {
        "dia": "10",
        "diaSemana": "QUINTA",
        "registros": {
          "Entrada": "10:06",
          "Almoco": "13:11",
          "Retorno": "14:11",
          "Saida": "19:15"
        }
      },
      {
        "dia": "11",
        "diaSemana": "SEXTA",
        "registros": {
          "Entrada": "09:50",
          "Almoco": "12:29",
          "Retorno": "13:29",
          "Saida": "18:51"
        }
      },
      {
        "dia": "12",
        "diaSemana": "SÁBADO",
        "registros": "-"
      },
      {
        "dia": "13",
        "diaSemana": "DOMINGO",
        "registros": "-"
      },
      {
        "dia": "14",
        "diaSemana": "SEGUNDA",
        "registros": {
          "Entrada": "10:37",
          "Almoco": "13:14",
          "Retorno": "14:14",
          "Saida": "19:37"
        }
      },
      {
        "dia": "15",
        "diaSemana": "TERÇA",
        "registros": {
          "Entrada": "10:17",
          "Almoco": "13:19",
          "Retorno": "14:39",
          "Saida": "19:38"
        }
      },
      {
        "dia": "16",
        "diaSemana": "QUARTA",
        "registros": {
          "Entrada": "10:10",
          "Almoco": "12:17",
          "Retorno": "13:17",
          "Saida": "19:11"
        }
      },
      {
        "dia": "17",
        "diaSemana": "QUINTA",
        "registros": {
          "Entrada": "09:34",
          "Almoco": "12:38",
          "Retorno": "13:56",
          "Saida": "18:53"
        }
      },
      {
        "dia": "18",
        "diaSemana": "SEXTA",
        "registros": {
          "Entrada": "09:02",
          "Almoco": "12:52",
          "Retorno": "13:53",
          "Saida": "18:08"
        }
      },
      {
        "dia": "19",
        "diaSemana": "SÁBADO",
        "registros": "-"
      },
      {
        "dia": "20",
        "diaSemana": "DOMINGO",
        "registros": "-"
      },
      {
        "dia": "21",
        "diaSemana": "SEGUNDA",
        "registros": {
          "Entrada": "09:21",
          "Almoco": "13:49",
          "Retorno": "14:49",
          "Saida": "18:27"
        }
      },
      {
        "dia": "22",
        "diaSemana": "TERÇA",
        "registros": {
          "Entrada": "10:07",
          "Almoco": "13:07",
          "Retorno": "15:17",
          "Saida": "20:46"
        }
      },
      {
        "dia": "23",
        "diaSemana": "QUARTA",
        "registros": {
          "Entrada": "09:24",
          "Almoco": "13:20",
          "Retorno": "14:42",
          "Saida": "19:08"
        }
      },
      {
        "dia": "24",
        "diaSemana": "QUINTA",
        "registros": {
          "Entrada": "09:21",
          "Almoco": "12:59",
          "Retorno": "14:08",
          "Saida": "18:34"
        }
      },
      {
        "dia": "25",
        "diaSemana": "SEXTA",
        "registros": {
          "Entrada": "08:45",
          "Almoco": "12:54",
          "Retorno": "13:56",
          "Saida": "19:07"
        }
      },
      {
        "dia": "26",
        "diaSemana": "SÁBADO",
        "registros": "-"
      },
      {
        "dia": "27",
        "diaSemana": "DOMINGO",
        "registros": "-"
      },
      {
        "dia": "28",
        "diaSemana": "SEGUNDA",
        "registros": {
          "Entrada": "08:57",
          "Almoco": "13:28",
          "Retorno": "14:37",
          "Saida": "19:11"
        }
      },
      {
        "dia": "29",
        "diaSemana": "TERÇA",
        "registros": {
          "Entrada": "09:23",
          "Almoco": "13:06",
          "Retorno": "14:06",
          "Saida": "18:23"
        }
      },
      {
        "dia": "30",
        "diaSemana": "QUARTA",
        "registros": {
          "Entrada": "08:59",
          "Almoco": "13:51",
          "Retorno": "15:15",
          "Saida": "18:27"
        }
      },
      {
        "dia": "31",
        "diaSemana": "QUINTA",
        "registros": {
          "Entrada": "09:11",
          "Almoco": "13:13",
          "Retorno": "14:13",
          "Saida": "18:13"
        }
      }
    ]
  }

}
