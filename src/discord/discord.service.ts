import { PontoService } from '@/ponto/ponto.service';
import { UtilService } from '@/util/util.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';

import {
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';

@Injectable()
export class DiscordService implements OnModuleInit {
  constructor(
    private readonly util: UtilService,
    private readonly pontoService: PontoService,
  ) { }

  onModuleInit() {
    if (!this.util.env().DISCORD_ONLINE) {
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

    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) return;
      await interaction.deferReply();

      const { commandName, user } = interaction;

      try {
        const { data } = await axios.get(
          'https://n8n.dizelequefez.com.br/webhook/discord/usuarios',
          {
            params: {
              username: user.username,
            },
          },
        );

        const user = data[0].usuario;

        const commands = {
          tutorial: () =>
            interaction.editReply(
              '/inserir - Adicionar Ponto \n /visualizar - Visualizar Ponto',
            ),
          inserir: async () =>
            interaction.editReply(
              await this.pontoService.create({ username: user.username }),
            ),
          consultar: async () => {
            try {
              const usuario = interaction.options.getString('usuario');
              console.log('aqui tbm');

              if (usuario) {
                interaction.editReply(
                  await this.pontoService.findByusernameFormat(usuario),
                );
                return;
              }

         

              interaction.editReply(
                await this.pontoService.findByusernameFormat(data[0].usuario),
              );
            } catch {
              interaction.editReply('Usuário não Encontrado');
            }
          },
        };

        await commands[commandName]();

      } catch {
        interaction.editReply('Usuário nao cadastrado');
      }
    });

    client.login(this.util.env().DISCORD_TOKEN);
  }

  create() {
    const commands = [
      new SlashCommandBuilder()
        .setName('tutorial')
        .setDescription('Mostrar os camandos disponíveis.'),
      new SlashCommandBuilder()
        .setName('consultar')
        .setDescription('Consultar os registros do dia.'),
    ].map((cmd) => cmd.toJSON());

    const rest = new REST({ version: '10' }).setToken(
      this.util.env().DISCORD_TOKEN,
    );

    return rest.put(
      Routes.applicationCommands(this.util.env().DISCORD_CLIENT_ID),
      { body: commands },
    );
  }
}
