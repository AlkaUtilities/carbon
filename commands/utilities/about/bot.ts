import { ChatInputCommandInteraction, EmbedBuilder, Client } from 'discord.js';
import ms from 'ms';

interface dependency {
    name: string,
    url: string
};

module.exports = {
    subCommand: "about.bot",
    async execute(interaction:ChatInputCommandInteraction, client:Client) {
        const options = interaction.options;
        const developers:Array<string> = client.config.developersId;
        const ephemeral = options.getBoolean('ephemeral') === null ? true : options.getBoolean('ephemeral', true);
        let dependencies:Array<dependency> = [];
        const pkg = require('../../../package.json');
        
        for await (let [key, value] of Object.entries(pkg.dependencies)) {
            value = (value as string).replace('^', '')
            dependencies.push({ name: `${key}@${value}`, url: `https://www.npmjs.com/package/${key}/v/${value}`});
        }

        const embed = new EmbedBuilder()
            .setTitle(`${client.icon.alka.bot} ${client.user?.username}#${client.user?.discriminator}`)
            .setThumbnail(client.user?.displayAvatarURL() ? client.user.displayAvatarURL() : (client.user?.defaultAvatarURL ? client.user.defaultAvatarURL : null))
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('#0390fc')
            .setFields(
                {
                    name: 'Overview',
                    value:
                        `Developer(s) : ${developers.map((dev) => `<@${dev}> `)}\n` +
                        `Language : <:typescript:1018125528789680139>\n` +
                        `Links : [\[Avatar\]](${client.user?.displayAvatarURL()}) [\[Invite\]](https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=8&scope=bot%20applications.commands)\n`
                },
                {
                    name: 'Details',
                    value:
                        `Uptime: ${client?.uptime ? ms(client.uptime) : `There was an error trying to get the uptime of the bot.`}\n` +
                        `Servers: ${client.guilds.cache.size} server(s)\n`
                },
                // {
                //     name: 'Dependencies',
                //     value: `${dependencies.map((key) => `[${key.name}](${key.url})`).join(', ')}`
                // },
                {
                    name: 'Credits',
                    value:
                        `Database: [MongoDB](https://www.mongodb.com/)\n` +
                        `Hosting: [Replit](https://replit.com/), [Freshping](https://app.freshping.io/)\n` +
                        `Status page: [Instatus](https://instatus.com/)\n` +
                        `Icons: [Icons8](https://icons8.com/), [Emoji.gg](https://emoji.gg/)\n` +
                        `Special thanks to: [Lyxcode](https://www.youtube.com/c/Lyxcode)`
                }
            )

        const dependenciesEmbed = new EmbedBuilder()
                .setTitle(`Dependencies (${dependencies.length})`)
                .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setThumbnail('https://avatars.githubusercontent.com/u/6078720')
                .setTimestamp()
                .setColor('#0390fc')
                .setDescription(`${dependencies.map((key) => `[${key.name}](${key.url})`).join(', ')}`)
                

        return interaction.followUp({ embeds: [embed, dependenciesEmbed], ephemeral: ephemeral });
    }
}