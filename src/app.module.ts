import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AppController } from '@/app.controller';
import { PointModule } from './point/point.module';
import { DiscordService } from './discord/discord.service';
import { DiscordModule } from './discord/discord.module';

@Module({
  imports: [
    AuthModule,
    PointModule,
    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    DiscordModule,
  ],
  providers: [AppService, DiscordService],
  controllers: [AppController],
})
export class AppModule {}
