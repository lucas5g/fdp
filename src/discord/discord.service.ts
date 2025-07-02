import { PontoService } from '@/ponto/ponto.service';
import { UtilService } from '@/util/util.service';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { Client, Events, GatewayIntentBits, Interaction, Partials, REST, Routes, SlashCommandBuilder } from 'discord.js';

@Injectable()
export class DiscordService implements OnModuleInit {
  constructor(private readonly util: UtilService, private readonly pontoService: PontoService) {}

   onModuleInit() {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [Partials.Channel],
    });

    client.once(Events.ClientReady, () => {
      console.log(`✅ Bot online ${client.user?.tag}`);
    });

    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const { commandName, user  } = interaction;
      console.log(user.username)


      if (commandName === 'tutorial') {
        interaction.reply('/inserir - Adicionar Ponto \n /visualizar - Visualizar Ponto');
      }

      if(commandName === 'visualizar'){
        
        interaction.reply('Visualizar Ponto');
      }

      if (commandName === 'inserir') {
        interaction.reply('Adicionar Ponto');
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
        .setName('visualizar')
        .setDescription('Visualizar Ponto'),
    ].map(cmd => cmd.toJSON());

    const rest = new REST({ version: '10' }).setToken(this.util.env().DISCORD_TOKEN);

    return  rest.put(Routes.applicationCommands(this.util.env().DISCORD_CLIENT_ID), { body: commands });


  }

}
