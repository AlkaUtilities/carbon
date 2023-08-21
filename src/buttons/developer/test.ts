import { ButtonInteraction, Client, EmbedBuilder } from "discord.js";

module.exports = {
    id: "test",
    async execute(interaction: ButtonInteraction, client: Client, args: any[]) {
        const target = args[0]; // Accessing the id that was passed into the button
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Hello world")
                    .setDescription(`${target}`),
            ],
            ephemeral: true,
        });
    },
};
