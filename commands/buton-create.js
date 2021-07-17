const Discord = require('discord.js');
const config = require('../Settings/config.json')
const Nuggies = require('nuggies');


module.exports = {
    name: 'buton-olustur',
    aliases: ['create-button'],
    run: async(client, message, args) => {

const brmanager = new Nuggies.buttonroles();
	message.channel.send('`roleID renk yazı emoji` diziliminde bir mesaj yaz ve mesajı gönderdikten sonra `onayla` yaz.');

	/**
	 * @param {Discord.Message} message
	 */
	const filter = m => m.author.id === message.author.id;
	const collector = message.channel.createMessageCollector(filter, { max: Infinity });

	collector.on('collect', async (msg) => {
		if (!msg.content) return message.channel.send('Invalid syntax');
		if (msg.content.toLowerCase() == 'onayla') return collector.stop('ONAYLA');
		const colors = ['grey', 'gray', 'red', 'blurple', 'green'];
		if (!msg.content.split(' ')[0].match(/[0-9]{18}/g) || !colors.includes(msg.content.split(' ')[1])) return message.channel.send('Invalid syntax');

		const role = msg.content.split(' ')[0];
		
		if (!role) return message.channel.send('Geçersiz Rol');

		const color = colors.find(color => color == msg.content.split(' ')[1]);
		if (!color) return message.channel.send('Geçersiz Renk');

		const label = msg.content.split(' ').slice(2, msg.content.split(' ').length - 1).join(' ');

		const reaction = (await msg.react(msg.content.split(' ').slice(msg.content.split(' ').length - 1).join(' ')).catch(/*() => null*/console.log));

		const final = {
			role, color, label, emoji: reaction ? reaction.emoji.id || reaction.emoji.name : null,
		};
		brmanager.addrole(final);
	})

	collector.on('end', async (msgs, reason) => {
		if (reason == 'ONAYLA') {
			const embed = new Discord.MessageEmbed()
				.setTitle("Buton'a tıkla ve rolü al!")
				.setDescription('Aşağıdaki butona tıklayarak belirtilen rolü alabilirsin;')
				.setColor('RANDOM')
				.setTimestamp();
			Nuggies.buttonroles.create({ message, content: embed, role: brmanager, channelID: message.channel.id })
		}
	})

}}