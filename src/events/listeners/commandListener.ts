import { ChatInputCommandInteraction, Client, Events } from "discord.js";
import { Command, SubCommand } from "../../handlers/command_handler";

export const event = {
    name: Events.InteractionCreate,
    friendlyName: "CommandListener",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        if (!interaction.isChatInputCommand()) return;

        const command: Command = client.commands.get(interaction.commandName);

        if (
            command.developerOnly &&
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

        if (command.initialReply)
            await interaction.reply({
                content: "Processing your command...",
                ephemeral: true,
            });

        const subCommand = interaction.options.getSubcommand(false);

        if (subCommand && command.hasExternalSubcommand) {
            const subCommandFile: SubCommand | undefined =
                client.subCommands.get(
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
