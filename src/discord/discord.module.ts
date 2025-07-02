import { Module } from '@nestjs/common';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { PontoModule } from '@/ponto/ponto.module';

@Module({
  imports: [PontoModule],
  controllers: [DiscordController],
  providers: [DiscordService],
})
export class DiscordModule {}
