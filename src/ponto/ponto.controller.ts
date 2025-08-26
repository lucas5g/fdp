import { Controller, Get, Post } from '@nestjs/common';
import { PontoService } from './ponto.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthEntity } from '@/auth/entities/auth.entity';

@ApiBearerAuth()
@Controller('pontos')
export class PontoController {
  constructor(private readonly pontoService: PontoService) {}

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
  generate(@Auth() auth: AuthEntity) {
    return this.pontoService.generate(auth);
  }
}
