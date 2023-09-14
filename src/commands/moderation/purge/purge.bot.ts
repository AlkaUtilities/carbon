import { ChannelType, ChatInputCommandInteraction, Client } from "discord.js";
import { results } from "./functions";

export const command = {
    subCommand: "purge.bot",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        let amount = interaction.options.getInteger("amount", true);
        if (amount > 100) amount = 100;
        if (amount < 1) amount = 1;
        if (interaction.channel?.type === ChannelType.DM) return;

        const fetch = await interaction.channel?.messages.fetch({
            limit: amount,
        });
        if (!fetch)
            return interaction.editReply({ content: `Messages not found.` }); // get rids of undefined in fetch type

        const filtered = fetch.filter((m) => m.author.bot);

        const deletedMessages: any = await interaction?.channel?.bulkDelete(
            filtered,
            true
        );
        if (!deletedMessages)
            return interaction.editReply({
                content: `Deleted messages not found.`,
            }); // get rids of undefined in fetch type
        results(deletedMessages, interaction);
    },
};
