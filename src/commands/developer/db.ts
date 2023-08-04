import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
} from "discord.js";
import GuildSchema from "../../schemas/guilds";

module.exports = {
    name: "db",
    disabled: false, // is the command disabled?
    hasESub: false, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developer: true, // is command developer only?
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

            case "delete": {
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
        }
    },
};
