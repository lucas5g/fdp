import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AppController } from '@/app.controller';
import { PointModule } from './point/point.module';

@Module({
  imports: [
    AuthModule,
    PointModule,
    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
