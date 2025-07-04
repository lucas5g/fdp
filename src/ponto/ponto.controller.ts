import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PontoService } from './ponto.service';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { FindAllPontoDto } from '@/ponto/dto/find-all-ponto.dto';

@Controller('pontos')
export class PontoController {
  constructor(private readonly pontoService: PontoService) {}

  @Post()
  create(@Body() createPontoDto: CreatePontoDto) {
    return this.pontoService.create(createPontoDto);
  }

  @Get()
  findAll(@Query() query: FindAllPontoDto) {
    return this.pontoService.findAll(query);
  }

  @Get('username/:username')
  findByUsername(@Param('username') username: string) {
    return this.pontoService.findByUsername(username);
  }

  @Get('username/:username/formatado')
  findByusernameFormat(@Param('username') username: string) {
    return this.pontoService.findByusernameFormat(username);
  }
}
