import { handleBalanceCommand } from './balance.js';
import { handleTransferCommand } from './transfer.js';
import { handleAssetsCommand } from './assets.js';
import { handleAdminCommands } from './admin.js';
import { logger } from '../utils/logger.js';

export async function handleCommand(message) {
  const args = message.content.slice(1).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  try {
    switch (command) {
      case 'balance':
        await handleBalanceCommand(message);
        break;
      case 'transfer':
        await handleTransferCommand(message, args);
        break;
      case 'assets':
        await handleAssetsCommand(message);
        break;
      case 'addmoney':
      case 'createasset':
      case 'assignasset':
        await handleAdminCommands(message, command, args);
        break;
      default:
        await message.reply('Unknown command. Try !balance, !transfer, or !assets');
    }
  } catch (error) {
    logger.error(`Error handling command ${command}:`, error);
    await message.reply('An error occurred while processing your command.');
  }
}