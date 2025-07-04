import { env } from '@/env';
import { PontoService } from '@/ponto/ponto.service';
import { UtilService } from '@/util/util.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';

import {
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  Message,
  Partials,
} from 'discord.js';

@Injectable()
export class DiscordService implements OnModuleInit {
  constructor(
    private readonly util: UtilService,
    private readonly pontoService: PontoService,
  ) { }

  onModuleInit() {
    if (!env.DISCORD_ONLINE) {
      Logger.debug('Discord bot is disabled');
      return;
    }

    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
      partials: [Partials.Channel],
    });

    client.once(Events.ClientReady, () => {
      Logger.debug(`✅ Bot online ${client.user?.tag}`);
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) return;
      await interaction.deferReply();

      const { commandName, user } = interaction;

      try {
        const {
          data,
        }: {
          data: { usuario: string }[];
        } = await axios.get(
          'https://n8n.dizelequefez.com.br/webhook/discord/usuarios',
          {
            params: {
              username: user.username,
            },
          },
        );

        const userPoint = data[0].usuario;

        const commands: Record<string, () => Promise<Message<boolean>>> = {
          inserir: async () =>
            interaction.editReply(
              await this.pontoService.create({ username: userPoint }),
            ),
          consultar: async () => {
            const userFilter = interaction.options.getString('usuario');

            const res = await this.pontoService.findByusernameFormat(
              userFilter ?? userPoint,
            );
            return interaction.editReply(res);
          },
        };

        await commands[commandName]();
      } catch {
        void interaction.editReply('Usuário nao cadastrado');
      }
    });

    void client.login(env.DISCORD_TOKEN);
  }
}
