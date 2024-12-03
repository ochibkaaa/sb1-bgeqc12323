# Simple Discord Bot

This is a simple Discord bot that handles basic currency commands.

## Features

- Basic currency system
- SQLite database integration
- Simple commands: !balance, !add, !transfer

## Setup

1. Install requirements:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file and add your Discord bot token:
   ```
   DISCORD_TOKEN=your_discord_token_here
   ```

3. Run the bot:
   ```
   python bot.py
   ```

## Commands

- `!balance` - Check your balance
- `!add <amount>` - Add coins (admin only)
- `!transfer <@user> <amount>` - Transfer coins to another user