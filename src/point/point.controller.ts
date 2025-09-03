import { Controller, Get, Post } from '@nestjs/common';
import { PointService } from './point.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthEntity } from '@/auth/entities/auth.entity';

@ApiBearerAuth()
@Controller('pontos')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post()
  create(@Auth() auth: AuthEntity) {
    return this.pointService.create(auth);
  }

  @Get('mes')
  findAll(@Auth() auth: AuthEntity) {
    return this.pointService.findAll(auth);
  }

  @Get('dia')
  findByDay(@Auth() auth: AuthEntity) {
    return this.pointService.findByDay(auth);
  }

  @Get('gerar')
  generate(@Auth() auth: AuthEntity) {
    return this.pointService.generate(auth);
  }
}
