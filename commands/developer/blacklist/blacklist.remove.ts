import { ChatInputCommandInteraction, Client } from "discord.js";
import UserBlacklist from '../../../schemas/userBlacklist';
import GuildBlacklist from '../../../schemas/guildBlacklist';

module.exports = {
    subCommand: "blacklist.remove",
    async execute(interaction:ChatInputCommandInteraction, client:Client) {
        const option = interaction.options.getString('options', true);
        let id:any = interaction.options.getString('id', true);
        
        if(Number.isNaN(Number(id))) return interaction.followUp({ content: "ID is not a number." });
        
        switch (option) {
            case 'user': {
                try {
                    let Data = await UserBlacklist.findOne({ UserID: id });
                    if (!Data) return interaction.followUp({ content: `User with id ${id} is not blacklisted.` });
                    await Data.delete();
                    interaction.followUp({ content: `Unblacklised user with id ${id}` });
                } catch (err) {
                    return interaction.followUp({ content: `There was an error unblacklisting user with id \`${id}\`` });
                }
            };
            break;

            case 'guild': {
                try {
                    let Data = await GuildBlacklist.findOne({ UserID: id });
                    if (!Data) return interaction.followUp({ content: `User with id ${id} is not blacklisted.` });
                    await Data.delete();
                    interaction.followUp({ content: `Unblacklised user with id ${id}` });
                } catch (err) {
                    return interaction.followUp({ content: `There was an error unblacklisting user with id \`${id}\`` });
                }
            };
            break;
        }
    }
}