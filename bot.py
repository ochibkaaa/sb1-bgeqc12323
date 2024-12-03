import os
import discord
from discord.ext import commands
from dotenv import load_dotenv
from database import Database

# Load environment variables
load_dotenv()

# Bot setup
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)
db = Database()

@bot.event
async def on_ready():
    print(f'{bot.user} has connected to Discord!')
    await db.init_db()

@bot.command(name='balance')
async def balance(ctx):
    balance = await db.get_balance(ctx.author.id)
    await ctx.send(f'Your balance: {balance} coins')

@bot.command(name='add')
async def add_money(ctx, amount: int):
    if not ctx.author.guild_permissions.administrator:
        await ctx.send("You don't have permission to use this command!")
        return
    
    await db.add_balance(ctx.author.id, amount)
    await ctx.send(f'Added {amount} coins to your balance')

@bot.command(name='transfer')
async def transfer(ctx, recipient: discord.Member, amount: int):
    if amount <= 0:
        await ctx.send("Amount must be positive!")
        return
        
    sender_balance = await db.get_balance(ctx.author.id)
    if sender_balance < amount:
        await ctx.send("Insufficient funds!")
        return
        
    await db.transfer(ctx.author.id, recipient.id, amount)
    await ctx.send(f'Transferred {amount} coins to {recipient.name}')

if __name__ == '__main__':
    bot.run(os.getenv('DISCORD_TOKEN'))