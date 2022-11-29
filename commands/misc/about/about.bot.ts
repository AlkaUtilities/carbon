import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Client,
    version,
} from "discord.js";
import { connection } from "mongoose";
import os from "node:os";
import ms from "ms";

interface dependency {
    name: string;
    url: string;
}

module.exports = {
    subCommand: "about.bot",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        const options = interaction.options;
        const ephemeral = options.getBoolean("ephemeral") ?? true;
        await interaction.deferReply({ ephemeral: ephemeral });
        const status = [
            `${client.icon.false} Disconnected`,
            `${client.icon.true} Connected`,
            `${client.icon.sync} Connecting`,
            `${client.icon.sync} Disconnecting`,
        ];
        const developers: Array<string> = client.config.developersId;
        let dependencies: Array<dependency> = [];
        const pkg = require("../../../package.json");

        for await (let [key, value] of Object.entries(pkg.dependencies)) {
            value = (value as string).replace("^", "");
            dependencies.push({
                name: `${key}@${value}`,
                url: `https://www.npmjs.com/package/${key}/v/${value}`,
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(
                `${client.icon.alka.bot} ${client.user?.username}#${client.user?.discriminator}`
            )
            .setThumbnail(
                client.user?.displayAvatarURL()
                    ? client.user.displayAvatarURL()
                    : client.user?.defaultAvatarURL
                    ? client.user.defaultAvatarURL
                    : null
            )
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor("#0390fc")
            .setFields(
                {
                    name: "General",
                    value: [
                        `${
                            developers.length > 1
                                ? "**Developers**"
                                : "**Developer**"
                        }: ${developers.map((dev) => `<@${dev}> `)}`,
                        `**Language**: <:typescript:1018125528789680139>`,
                        `**Links**: [\[Avatar\]](${client.user?.displayAvatarURL()}) [\[Invite\]](https://discord.com/api/oauth2/authorize?client_id=${
                            client.user?.id
                        }&permissions=8&scope=bot%20applications.commands) [\[GitHub\]](https://github.com/alkautilities/nadc)`,
                        `Database Status : ${status[connection.readyState]}`,
                    ].join("\n"),
                },
                {
                    name: "System",
                    value: [
                        `**Uptime**: ${
                            client?.uptime
                                ? ms(client.uptime)
                                : `There was an error trying to get the uptime of the bot.`
                        }`,
                        `**Latency**: ${
                            Date.now() - interaction.createdTimestamp
                        } ms`,
                        `**API Latency**: ${client.ws.ping} ms`,
                        `**Node.js Version**: ${process.version.slice(
                            1 /* hides the 'v' in 'v1.2.3' */
                        )}`,
                        `**Discord.js Version**: ${version}`,
                        `**Memory Usage**: ${Math.round(
                            process.memoryUsage().heapUsed / (1024 * 1024)
                        )} MB\n`,
                    ].join("\n"),
                },
                {
                    name: "Statistics",
                    value: [
                        `**Servers**: ${client.guilds.cache.size}`,
                        `**Users**: ${client.users.cache.size}`,
                        `**Commands**: ${client.commands.size}`,
                        `**Dependencies**: ${dependencies.length}`,
                    ].join("\n"),
                }
                // {
                //     name: 'Dependencies',
                //     value: `${dependencies.map((key) => `[${key.name}](${key.url})`).join(', ')}`
                // },
                // {
                //     name: "Other 3rd parties",
                //     value:
                //         `Database : [MongoDB](https://www.mongodb.com/)`,
                //         `Icons : [Icons8](https://icons8.com/), [Emoji.gg](https://emoji.gg/)\n`,
                // }
            );

        // FIXME will cause error if dependencies exceeds maximum description length
        const dependenciesEmbed = new EmbedBuilder()
            .setTitle(`Dependencies (${dependencies.length})`)
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setThumbnail(
                "https://github.com/npm/logos/raw/master/npm%20square/n-64.png"
            )
            .setTimestamp()
            .setColor("#0390fc")
            .setDescription(
                `${dependencies
                    .map((key) => `[${key.name}](${key.url})`)
                    .join("\n")}`
            );

        return interaction.editReply({
            embeds: [embed, dependenciesEmbed],
        });
    },
};
