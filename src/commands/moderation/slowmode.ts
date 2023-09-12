import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import ms from "ms";
module.exports = {
    name: "slowmode",
    disabled: false, // is the command disabled?
    hasExternalSubcommand: true, // does the command has an external sub command?
    // initialReply: false, // does command execute with an initial reply?
    developer: false, // is command developer only?
    global: true,
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Slowmode")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false)
        .addSubcommand((option) =>
            option
                .setName("set")
                .setDescription("Sets the slowmode for current channel")
                .addStringOption((string) =>
                    string
                        .setName("rate")
                        .setDescription(
                            "The rate at which the user can send a new message (5s, 1m, 30m, etc.)"
                        )
                        .setRequired(true)
                )
                .addStringOption((string) =>
                    string
                        .setName("reason")
                        .setDescription("Reason for enabling slowmode")
                )
                .addStringOption((string) =>
                    string
                        .setName("duration")
                        .setDescription(
                            "Duration for the slowmode (5s, 1m, 30m, etc.), after which it will disable itself."
                        )
                )
        )
        .addSubcommand((option) =>
            option
                .setName("disable")
                .setDescription("Disables the slowmode for current channel")
                .addStringOption((string) =>
                    string
                        .setName("reason")
                        .setDescription("Reason for disabling slowmode")
                )
                .addStringOption((string) =>
                    string
                        .setName("duration")
                        .setDescription(
                            "Duration for the disabled slowmode (5s, 1m, 30m, etc.), after which it will enable itself."
                        )
                )
        ),
};
