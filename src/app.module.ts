import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DiscordModule } from './discord/discord.module';
import { PontoModule } from './ponto/ponto.module';
import { UtilModule } from './util/util.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DiscordModule, PontoModule, UtilModule, ScheduleModule.forRoot()],
  providers: [AppService],
})
export class AppModule {}
