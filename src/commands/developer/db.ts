import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    AttachmentBuilder,
} from "discord.js";
import { inspect } from "node:util";

import GuildSchema from "../../schemas/guilds";

export const command = {
    name: "db",
    disabled: false, // is the command disabled?
    hasExternalSubcommand: false, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developerOnly: true, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("db")
        .setDescription("Manage guild database")
        .setDMPermission(false)
        .addSubcommand((sub) =>
            sub
                .setName("create")
                .setDescription(
                    "Force create guild document for current guild (if doesnt exist)"
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName("delete")
                .setDescription(
                    "Force delete guild document for current guild (if exist)"
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName("check")
                .setDescription(
                    "Shows the guild document content for current guild (if exist)"
                )
        ),
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        switch (interaction.options.getSubcommand()) {
            case "create":
                {
                    let guildDocument = await GuildSchema.findOne({
                        GuildID: interaction.guildId,
                    });

                    if (guildDocument)
                        return interaction.reply({
                            content: `Guild object already exists!\nDocument ID: \`${guildDocument.id}\``,
                        });

                    guildDocument = await GuildSchema.create({
                        GuildID: interaction.guildId,
                    });

                    await guildDocument.save();

                    return interaction.reply({
                        content: `Successfully created document!\nDocument ID: \`${guildDocument.id}\``,
                    });
                }
                break;

            case "delete":
                {
                    let guildDocument = await GuildSchema.findOne({
                        GuildID: interaction.guildId,
                    });

                    if (!guildDocument)
                        return interaction.reply({
                            content: `Guild object does not already exists!`,
                        });

                    guildDocument.deleteOne();

                    return interaction.reply({
                        content: `Successfully deleted document!`,
                    });
                }
                break;

            case "check":
                {
                    let guildDocument = await GuildSchema.findOne({
                        GuildID: interaction.guildId,
                    });

                    if (!guildDocument)
                        return interaction.reply({
                            content: `Guild object does not already exists!`,
                        });

                    const result = inspect(guildDocument, {
                        depth: Infinity,
                        colors: true,
                    });

                    return interaction.reply({
                        files: [
                            new AttachmentBuilder(Buffer.from(result), {
                                name: "inspect.ansi",
                            }),
                        ],
                    });
                }
                break;
        }
    },
};
