import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PontoService } from './ponto.service';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { FindAllPontoDto } from '@/ponto/dto/find-all-ponto.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('pontos')
export class PontoController {
  constructor(private readonly pontoService: PontoService) {}

  @Post()
  @ApiBody({ type: CreatePontoDto })
  // @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/x-www-form-urlencoded') // <- ESSENCIAL
  create(@Body() createPontoDto: CreatePontoDto) {
    return this.pontoService.create(createPontoDto);
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
