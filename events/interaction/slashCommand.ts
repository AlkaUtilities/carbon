import { ChatInputCommandInteraction, Client  } from "discord.js";

module.exports = {
    name: 'interactionCreate',
    friendlyName: 'slashCommand',
    execute(interaction:ChatInputCommandInteraction, client:Client) {
        if (!interaction.isChatInputCommand) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return interaction.reply({ content: "This command is outdated.", ephemeral: true });
        
        command.execute(interaction, client);
    }
}