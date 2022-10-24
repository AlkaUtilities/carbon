import { ChannelType, ChatInputCommandInteraction, Client } from "discord.js";
import { results } from './functions';

module.exports = {
    subCommand: "purge.user",
    async execute(interaction:ChatInputCommandInteraction, client:Client) {
        const user = interaction.options.getUser('user', true);
        let amount = interaction.options.getInteger('amount', true);
        if (amount > 100) amount = 100;
        if (amount < 1) amount = 1;
        if (interaction.channel?.type === ChannelType.DM) return;

        const fetch = await interaction.channel?.messages.fetch({ limit: amount });
        if (!fetch) return interaction.reply({ content: `Messages not found.` }); // get rids of undefined in fetch type

        const filtered = fetch.filter((m) => m.author.id == user.id);

        const deletedMessages:any = await interaction?.channel?.bulkDelete(filtered, true);
        if (!deletedMessages) return interaction.reply({ content: `Deleted messages not found.` }); // get rids of undefined in fetch type
        results(deletedMessages, interaction);
    }
}