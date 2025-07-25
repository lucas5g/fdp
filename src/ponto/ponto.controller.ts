import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { PontoService } from './ponto.service';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { FindAllPontoDto } from '@/ponto/dto/find-all-ponto.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { LoginPontoDto } from './dto/login-ponto.dto';

@Controller('pontos')
export class PontoController {
  constructor(private readonly pontoService: PontoService) {}

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

}
