import { PointService } from '@/point/point.service';
import { PrismaService } from '@/prisma/prisma.service';
import { env } from '@/utils/env';
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Client, GatewayIntentBits, Interaction } from 'discord.js';

@Injectable()
export class DiscordService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  constructor(
    private pointService: PointService,
    private prisma: PrismaService,
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  async onModuleInit() {
    // Substitua 'YOUR_BOT_TOKEN' pelo token real do seu bot
    await this.client.login(env.DISCORD_BOT_TOKEN);
    this.client.on('clientReady', () => {
      Logger.debug(`Bot do Discord logado como ${this.client.user?.tag}`);
    });

    this.client.on('interactionCreate', (interaction) => {
      void this.handleInteraction(interaction);
    });
  }

  async onModuleDestroy() {
    await this.client.destroy();
  }

  private async handleInteraction(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    await interaction.deferReply();
    // console.log(interaction)
    const { commandName, user } = interaction;

    const auth = await this.prisma.user.findUniqueOrThrow({
      where: { discordUser: user.username },
    });

    if (commandName === 'pontos') {
      const res = await this.pointService.findByDay(auth);
      const message = `Entrada: ${res.start}\nInício do almoço: ${res.lunch}\nFim do almoço: ${res.lunchEnd}\nSaída: ${res.end}\nHoras trabalhadas: ${res.hoursWorked}`;
      return interaction.editReply(message);
    }

    if (commandName === 'bater-ponto') {
      try {
        await this.pointService.create(auth);
        return interaction.editReply(`Ponto batido com sucesso!`);
      } catch (error: any) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return interaction.editReply(`Erro ao bater ponto: ${errorMsg}`);
      }
    }
  }
}
