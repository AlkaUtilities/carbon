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

const status = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

module.exports = {
    subCommand: "about.bot",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        const options = interaction.options;
        const developers: Array<string> = client.config.developersId;
        const ephemeral =
            options.getBoolean("ephemeral") === null
                ? true
                : options.getBoolean("ephemeral", true);
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
                    value:
                        `${
                            developers.length > 1 ? "Developers" : "Developer"
                        } : ${developers.map((dev) => `<@${dev}> `)}\n` +
                        `Language : <:typescript:1018125528789680139>\n` +
                        `Links : [\[Avatar\]](${client.user?.displayAvatarURL()}) [\[Invite\]](https://discord.com/api/oauth2/authorize?client_id=${
                            client.user?.id
                        }&permissions=8&scope=bot%20applications.commands) [\[GitHub\]](https://github.com/alkautilities/nadc)\n` +
                        `Database Status : ${status[connection.readyState]}`,
                },
                {
                    name: "System",
                    value:
                        `Uptime : ${
                            client?.uptime
                                ? ms(client.uptime)
                                : `There was an error trying to get the uptime of the bot.`
                        }\n` +
                        `Node.js Version : ${process.version.slice(
                            1 /* hides the 'v' in 'v1.2.3' */
                        )}\n` +
                        `Discord.js Version : ${version}\n` +
                        `Memory Usage : ${Math.round(
                            process.memoryUsage().heapUsed / (1024 * 1024)
                        )} MB\n`,
                },
                {
                    name: "Statistics",
                    value:
                        `Servers : ${client.guilds.cache.size}\n` +
                        `Users : ${client.users.cache.size}\n` +
                        `Commands : ${client.commands.size}\n` +
                        `Dependencies: ${dependencies.length}\n`,
                }
                // {
                //     name: 'Dependencies',
                //     value: `${dependencies.map((key) => `[${key.name}](${key.url})`).join(', ')}`
                // },
                // {
                //     name: "Other 3rd parties",
                //     value:
                //         `Database : [MongoDB](https://www.mongodb.com/)\n` +
                //         `Icons : [Icons8](https://icons8.com/), [Emoji.gg](https://emoji.gg/)\n`,
                // }
            );

        // FIXME Will cause error if dependencies exceeds maximum description length
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
                    .join(", ")}`
            );

        return interaction.followUp({
            embeds: [embed, dependenciesEmbed],
            ephemeral: ephemeral,
        });
    },
};
