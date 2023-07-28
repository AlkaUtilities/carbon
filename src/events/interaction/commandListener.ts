import { ChatInputCommandInteraction, Client } from "discord.js";
import UserBlacklist from "../../schemas/userBlacklist";
import GuildBlacklist from "../../schemas/guildBlacklist";

module.exports = {
    name: "interactionCreate",
    friendlyName: "CommandListener",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        if (!interaction.isChatInputCommand) return;

        const command = client.commands.get(interaction.commandName);
        const GuildBlacklistData = await GuildBlacklist.findOne({
            GuildID: interaction.guildId,
        }).catch((err) => {});
        const UserBlacklistData = await UserBlacklist.findOne({
            UserID: interaction.user.id,
        }).catch((err) => {});

        if (
            command.developer &&
            !client.config.developersId.includes(interaction.user.id)
        )
            return await interaction.reply({
                content: "You don't have access to this command.",
                ephemeral: true,
            });
        if (!command || command.disabled)
            return await interaction.reply({
                content: "This command is outdated.",
                ephemeral: true,
            });

        // Blacklist checks
        if (GuildBlacklistData)
            return await interaction.reply({
                content: `This server has been blacklisted from using this bot on <t:${GuildBlacklistData?.Time?.toString().slice(
                    0,
                    10
                )}:f>\nReason: ${GuildBlacklistData?.Reason}`,
                ephemeral: true,
            });

        if (UserBlacklistData)
            return await interaction.reply({
                content: `You have been blacklisted from using this bot on <t:${UserBlacklistData?.Time?.toString().slice(
                    0,
                    10
                )}:f>\nReason: ${UserBlacklistData?.Reason}`,
                ephemeral: true,
            });

        if (command.initialReply)
            await interaction.reply({
                content: "Processing your command...",
                ephemeral: true,
            });

        const subCommand = interaction.options.getSubcommand(false);

        if (subCommand && command.hasESub) {
            const subCommandFile = client.subCommands.get(
                `${interaction.command?.name}.${subCommand}`
            );
            if (!subCommandFile) {
                return interaction.reply({
                    content: "This sub command is outdated.",
                    ephemeral: true,
                });
            }
            subCommandFile.execute(interaction, client);
        } else {
            command.execute(interaction, client);
        }
    },
};
