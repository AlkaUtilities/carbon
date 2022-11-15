import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
} from "discord.js";
module.exports = {
    name: "xp",
    disabled: false, // is the command disabled?
    hasESub: true, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developer: false, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("xp")
        .setDescription("Manage member's XP")
        .addSubcommand((option) =>
            option
                .setName("set")
                .setDescription("Set member's XP to a given value")
                .addUserOption((user) =>
                    user
                        .setName("member")
                        .setDescription("Member to set XP to")
                        .setRequired(true)
                )
                .addNumberOption((number) =>
                    number
                        .setName("amount")
                        .setDescription("Amount of XP to set")
                        .setRequired(true)
                )
        )
        .addSubcommand((option) =>
            option
                .setName("give")
                .setDescription("Add a given value to member's XP ")
                .addUserOption((user) =>
                    user
                        .setName("member")
                        .setDescription("Member to give XP to")
                        .setRequired(true)
                )
                .addNumberOption((number) =>
                    number
                        .setName("amount")
                        .setDescription("Amount of XP to give")
                        .setRequired(true)
                )
        )
        .addSubcommand((option) =>
            option
                .setName("remove")
                .setDescription("Remove a given value from member's XP")
                .addUserOption((user) =>
                    user
                        .setName("member")
                        .setDescription("Member to remove XP from")
                        .setRequired(true)
                )
                .addNumberOption((number) =>
                    number
                        .setName("amount")
                        .setDescription(
                            "Amount of XP to remove (cannot be more than member's current xp)"
                        )
                        .setRequired(true)
                )
        )
        .setDMPermission(false),
};
