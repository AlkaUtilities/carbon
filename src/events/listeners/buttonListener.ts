import { ButtonInteraction, Client, Events } from "discord.js";

export const event = {
    name: Events.InteractionCreate,
    friendlyName: "ButtonListener",
    async execute(interaction: ButtonInteraction, client: Client) {
        if (!interaction.isButton()) return;
        const buttonCustomId = interaction.customId.split(".");
        const button = client.buttons.get(buttonCustomId[0]);
        if (!button)
            return interaction.reply({
                content: `Button not found. \`${interaction.customId}\``,
                ephemeral: true,
            });

        button.execute(interaction, client, buttonCustomId.slice(1));
    },
};
