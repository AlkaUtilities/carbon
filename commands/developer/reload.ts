import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
import { load_commands } from '../../handlers/command_handler';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription("Reloads the bot")
        .addSubcommand((o) => o
            .setName('commands')
            .setDescription("Reloads all commands")
        )
        .addSubcommand((o) => o
            .setName('events')
            .setDescription("Reloads all events")
        ),
    initialReply: true,
    developer: true,
    async execute(interaction:ChatInputCommandInteraction, client:Client) {
        switch (interaction.options.getSubcommand()) {
            // TODO Reload events
            case 'commands': {
                await load_commands(client)
                    .then(async () => {
                        await interaction.followUp("Reloaded commands.");
                    });
                return;
            }
            break;
        }
    }
}