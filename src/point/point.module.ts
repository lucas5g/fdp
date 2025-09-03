import { Module } from '@nestjs/common';
import { UserModule } from '@/user/user.module';
import { PointService } from './point.service';
import { PointController } from './point.controller';

@Module({
  imports: [UserModule],
  controllers: [PointController],
  providers: [PointService],
  exports: [PointService],
})
export class PointModule {}
