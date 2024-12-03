import { queries } from '../database/index.js';
import { logger } from '../utils/logger.js';

export async function handleBalanceCommand(message) {
  try {
    queries.createUser.run(message.author.id);
    const result = queries.getBalance.get(message.author.id);
    
    await message.reply(`Your current balance is ${result.balance} credits`);
  } catch (error) {
    logger.error('Error in balance command:', error);
    throw error;
  }
}