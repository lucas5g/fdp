import { Controller, Get, Param } from '@nestjs/common';
import { PontoService } from './ponto.service';

@Controller('pontos')
export class PontoController {
  constructor(private readonly pontoService: PontoService) {}

  @Get('username/:username')
  findByUsername(@Param('username') username: string) {
    return this.pontoService.findByUsername(username);
  }

  @Get('username/:username/formatado')
  findByusernameFormat(@Param('username') username: string) {
    return this.pontoService.findByusernameFormat(username);
  }
}
