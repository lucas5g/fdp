import { Controller, Get, Post } from '@nestjs/common';
import { PointService } from './point.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthEntity } from '@/auth/entities/auth.entity';

@ApiBearerAuth()
@Controller('points')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post()
  create(@Auth() auth: AuthEntity) {
    return this.pointService.create(auth);
  }

  @Get('month')
  findAll(@Auth() auth: AuthEntity) {
    return this.pointService.findAll(auth);
  }

  @Get('day')
  findByDay(@Auth() auth: AuthEntity) {
    return this.pointService.findByDay(auth);
  }

  @Get('generate')
  generate(@Auth() auth: AuthEntity) {
    return this.pointService.generate(auth);
  }
}
