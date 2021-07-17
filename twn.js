const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const db = require('quick.db');
const kdb = new db.table('kullanici');
const moment = require('moment');
const config = require('./Settings/config.json')
require('moment-duration-format')
const disbut = require('discord-buttons');
const commands = client.commands = new Discord.Collection();
const aliases = client.aliases = new Discord.Collection();
const Nuggies = require('nuggies');
require('discord-buttons')(client)


client.on('clickButton', button => {
  Nuggies.buttonclick(client, button)
});


fs.readdirSync('./commands', { encoding: 'utf8' }).filter(file => file.endsWith(".js")).forEach((files) => {
    let command = require(`./commands/${files}`);
    if (!command.name) return console.log(`Hatalı Kod Dosyası => [/commands/${files}]`)
    commands.set(command.name, command);
    if (!command.aliases || command.aliases.length < 1) return
    command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
})


client.on('message', message => {
    const prefix = config.prefix; // prefix
    if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if (!cmd) return;
    cmd.run(client, message, args)
})


client.on('ready', () => {
    client.user.setPresence({ activity: { name:  config.Activity }, status: 'idle' })
    client.channels.cache.get(config.BotVoiceChannel).join()})


client.login(config.token).then(console.log("[Twn]")).catch(e => console.error(e));