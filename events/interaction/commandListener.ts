import { ChatInputCommandInteraction, Client } from "discord.js";
import config from '../../config';

module.exports = {
    name: 'interactionCreate',
    friendlyName: 'commandListener',
    async execute(interaction:ChatInputCommandInteraction, client:Client) {
        if (!interaction.isChatInputCommand) return;

        const command = client.commands.get(interaction.commandName);

        if (command.developer && !config.developersId.includes(interaction.user.id)) return await interaction.reply({ content: "You don't have access to this command.", ephemeral: true });
        if (!command || command.disabled) return await interaction.reply({ content: "This command is outdated.", ephemeral: true });
        if (command.initialReply) await interaction.reply({ content: "Processing your command...", ephemeral: true });

        const subCommand = interaction.options.getSubcommand(false);

        if (subCommand && command.hasESub) {
            const subCommandFile = client.subCommands.get(`${interaction.command?.name}.${subCommand}`) // rootCommandName.subCommandName
            if (!subCommandFile) {
                return interaction.reply({ content: "This sub command is outdated.", ephemeral: true });
                //                   ^^^^^^
                // causes commands with subcommands that aren't split into multiple files to be marked as outdated.
                // return; // ignores the error and continue 
            }
            subCommandFile.execute(interaction, client);
        } else {
            command.execute(interaction, client);
        }
    }
}