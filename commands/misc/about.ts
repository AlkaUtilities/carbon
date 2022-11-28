import { SlashCommandBuilder } from "discord.js";

module.exports = {
    hasESub: true,
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription("Shows information about something.")
        .setDMPermission(false)
        .addSubcommand((option) =>
            option
                .setName("user")
                .setDescription("Shows information about mentioned user.")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user to show information about.")
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("ephemeral")
                        .setDescription(
                            "Reply as a message that only you can see or everyone can see (Default: true)"
                        )
                )
        )
        .addSubcommand((option) =>
            option
                .setName("server")
                .setDescription("Shows information about this server.")
                .addBooleanOption((option) =>
                    option
                        .setName("ephemeral")
                        .setDescription(
                            "Reply as a message that only you can see or everyone can see (Default: true)"
                        )
                )
        )
        .addSubcommand((option) =>
            option
                .setName("bot")
                .setDescription("Shows information about the bot.")
                .addBooleanOption((option) =>
                    option
                        .setName("ephemeral")
                        .setDescription(
                            "Reply as a message that only you can see or everyone can see (Default: true)"
                        )
                )
        ),
    initialReply: false,
};
