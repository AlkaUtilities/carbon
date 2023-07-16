import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
} from "discord.js";
module.exports = {
    name: "blacklist",
    disabled: false, // is the command disabled?
    hasESub: true, // does the command has an external sub command?
    initialReply: true, // does command execute with an initial reply?
    developer: true, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Blacklist")
        .setDMPermission(false)
        .addSubcommand((option) =>
            option
                .setName("add")
                .setDescription("Blacklists a user/guild")
                .addStringOption((string) =>
                    string
                        .setName("options")
                        .setDescription("User/Guild")
                        .setRequired(true)
                        .addChoices(
                            { name: "Guild", value: "guild" },
                            { name: "User", value: "user" }
                        )
                )
                .addStringOption((string) =>
                    string
                        .setName("id")
                        .setDescription("ID of User/Guild")
                        .setRequired(true)
                )
                .addStringOption((string) =>
                    string
                        .setName("reason")
                        .setDescription(
                            "Reason for blacklisting the user/guild"
                        )
                )
        )
        .addSubcommand((option) =>
            option
                .setName("remove")
                .setDescription("Removes a user/guild from the blacklist")
                .addStringOption((string) =>
                    string
                        .setName("options")
                        .setDescription("User/Guild")
                        .setRequired(true)
                        .addChoices(
                            { name: "Guild", value: "guild" },
                            { name: "User", value: "user" }
                        )
                )
                .addStringOption((string) =>
                    string
                        .setName("id")
                        .setDescription("ID of User/Guild")
                        .setRequired(true)
                )
        ),
};
