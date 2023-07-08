// credit goes to Static (https://stackoverflow.com/users/11321411/static)

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check bot's latency")
        .setDMPermission(true),
    global: true,
    execute(interaction: ChatInputCommandInteraction, client: Client) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pong!")
                    .setDescription(
                        `**Latency**: ${
                            Date.now() - interaction.createdTimestamp
                        } ms\n` + `**API Latency**: ${client.ws.ping} ms\n`
                    )
                    .setColor("#2f3136"),
            ],
            ephemeral: true,
        });
    },
};
