import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Client,
    version,
} from "discord.js";
import { connection } from "mongoose";
import ms from "ms";

// interface dependency {
//     name: string;
//     url: string;
// }

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
        // let dependencies: Array<dependency> = [];
        // const pkg = require("../../../package.json");

        // for await (let [key, value] of Object.entries(pkg.dependencies)) {
        //     value = (value as string).replace("^", "");
        //     dependencies.push({
        //         name: `${key}@${value}`,
        //         url: `https://www.npmjs.com/package/${key}/v/${value}`,
        //     });
        // }

        const embed = new EmbedBuilder()
            .setTitle(
                `${client.user?.username}${
                    client.user?.discriminator !== "0"
                        ? `#${client.user?.discriminator}`
                        : ""
                }`
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
                    name: "System",
                    value: [
                        `**Uptime**: ${
                            client?.uptime
                                ? ms(client.uptime)
                                : `There was an error trying to get the uptime of the bot.`
                        }`,
                        `**Memory Usage**: ${Math.round(
                            process.memoryUsage().heapUsed / (1024 * 1024)
                        )} MB`,
                        `**API Latency**: ${client.ws.ping} ms`,
                        `**Node.js Version**: ${process.version.slice(1)}`,
                        `**Discord.js Version**: ${version}\n`,
                    ].join("\n"),
                },
                {
                    name: "Database",
                    value: [
                        `**Status**: ${status[connection.readyState]}`,
                    ].join("\n"),
                }
            );

        return interaction.editReply({
            // embeds: [embed, dependenciesEmbed],
            embeds: [embed],
        });
    },
};
