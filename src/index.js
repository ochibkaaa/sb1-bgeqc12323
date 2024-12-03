import { Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/index.js';
import { handleCommand } from './commands/handler.js';
import { logger } from './utils/logger.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  logger.info(`Logged in as ${client.user.tag}`);
  initializeDatabase();
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  await handleCommand(message);
});

client.login(process.env.DISCORD_TOKEN);