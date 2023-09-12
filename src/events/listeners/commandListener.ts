import { ChatInputCommandInteraction, Client, Events } from "discord.js";

module.exports = {
    name: Events.InteractionCreate,
    friendlyName: "CommandListener",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

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

        if (command.initialReply)
            await interaction.reply({
                content: "Processing your command...",
                ephemeral: true,
            });

        const subCommand = interaction.options.getSubcommand(false);

        if (subCommand && command.hasExternalSubcommand) {
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
