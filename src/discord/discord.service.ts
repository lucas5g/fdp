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
      const message = `
          Entrada: ${res.start}
          Início do almoço: ${res.start}
          Fim do almoço: ${res.lunchEnd}
          Saída: ${res.end}
          Horas trabalhadas: ${res.hoursWorked}
        `;
      return interaction.editReply(message);
    }

    if (commandName === 'bater-ponto') {
      return interaction.editReply(
        'Ponto batido com sucesso! (implemente a lógica aqui)',
      );
    }
  }
}
