// credit goes to whois-MidNight (https://github.com/whois-MidNight)

import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export const command = {
    hasExternalSubcommand: true,
    global: true,
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription(
            "Delete a specific amount of messages from a target/channel"
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand((option) =>
            option
                .setName("all")
                .setDescription("Removes all messages.")
                .addIntegerOption((int) =>
                    int
                        .setName("amount")
                        .setDescription("Input amount")
                        .setMinValue(1)
                        .setMaxValue(100)
                        .setRequired(true)
                )
        )
        .addSubcommand((option) =>
            option
                .setName("user")
                .setDescription("Removes all messages from the user given.")
                .addIntegerOption((int) =>
                    int
                        .setName("amount")
                        .setDescription("Input amount")
                        .setMinValue(1)
                        .setMaxValue(100)
                        .setRequired(true)
                )
                .addUserOption((user) =>
                    user
                        .setName("user")
                        .setDescription("Input user")
                        .setRequired(true)
                )
        )
        .addSubcommand((option) =>
            option
                .setName("bot")
                .setDescription("Removes all messages made by bots.")
                .addIntegerOption((int) =>
                    int
                        .setName("amount")
                        .setDescription("Input amount")
                        .setMinValue(1)
                        .setMaxValue(100)
                        .setRequired(true)
                )
        ),
};
