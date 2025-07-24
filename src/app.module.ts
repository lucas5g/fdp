import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PontoModule } from './ponto/ponto.module';
import { UtilModule } from './util/util.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PontoModule, UtilModule, ScheduleModule.forRoot(), AuthModule],
  providers: [AppService],
})
export class AppModule {}
