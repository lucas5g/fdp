import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PontoModule } from './ponto/ponto.module';
import { UtilModule } from './util/util.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PontoModule, UtilModule, ScheduleModule.forRoot()],
  providers: [AppService],
})
export class AppModule {}
