const { Client, GatewayIntentBits } = require('discord.js')
require('dotenv/config')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

client.on('ready', () => {
    console.log('Duel-Bot is ready.')
})

client.on('messageCreate', message => {
    if (message === "ping") {
        message.reply("pong, stupid ass..");
    }
})

client.login(process.env.TOKEN)