import { ChatInputCommandInteraction, Client } from "discord.js";
import config from '../../config';
import UserBlacklist from '../../schemas/userBlacklist';
import GuildBlacklist from '../../schemas/guildBlacklist';

module.exports = {
    name: 'interactionCreate',
    friendlyName: 'commandListener',
    async execute(interaction:ChatInputCommandInteraction, client:Client) {
        if (!interaction.isChatInputCommand) return;

        const command = client.commands.get(interaction.commandName);
        const UserData = await UserBlacklist.findOne({ UserID: interaction.user.id }).catch((err) => {});
        const GuildData = await GuildBlacklist.findOne({ GuildID: interaction.guildId }).catch((err) => {});

        if (command.developer && !config.developersId.includes(interaction.user.id)) return await interaction.reply({ content: "You don't have access to this command.", ephemeral: true });
        if (!command || command.disabled) return await interaction.reply({ content: "This command is outdated.", ephemeral: true });

        // Blacklist checks
        if (GuildData) return await interaction.reply({ content: `This server blacklisted from using this bot on <t:${GuildData.Time.toString().slice(0, 10)}:f>\nReason: ${GuildData.Reason}` })
        if (UserData) return await interaction.reply({ content: `You have been blacklisted from using this bot on <t:${UserData.Time.toString().slice(0, 10)}:f>\nReason: ${UserData.Reason}` })

        if (command.initialReply) await interaction.reply({ content: "Processing your command...", ephemeral: true });

        const subCommand = interaction.options.getSubcommand(false);

        if (subCommand && command.hasESub) {
            const subCommandFile = client.subCommands.get(`${interaction.command?.name}.${subCommand}`)
            if (!subCommandFile) {
                return interaction.reply({ content: "This sub command is outdated.", ephemeral: true });
            }
            subCommandFile.execute(interaction, client);
        } else {
            command.execute(interaction, client);
        }
    }
}