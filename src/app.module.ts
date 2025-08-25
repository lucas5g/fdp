import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PontoModule } from './ponto/ponto.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AppController } from '@/app.controller';

@Module({
  imports: [
    AuthModule,
    PontoModule,
    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule { }
