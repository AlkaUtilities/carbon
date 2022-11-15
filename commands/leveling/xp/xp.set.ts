import { ChatInputCommandInteraction, Client } from "discord.js";
import UserLeveling from "../../../schemas/userLeveling";

module.exports = {
    subCommand: "xp.set",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        await interaction.deferReply();
        const { options, guild, guildId } = interaction;

        const user = options.getUser("member", true);
        if (user.bot)
            return interaction.editReply({
                content: "Specified member is a bot",
            });
        const member = guild?.members.cache.get(user.id);
        const amount = options.getNumber("amount", true);

        if (!member)
            return interaction.editReply({
                content: `Error: Specified user is not in server\nSpecified user: ${user.id}`,
            });

        if (amount < 0)
            return interaction.editReply({
                content: `Error: Amount cannot be less than 0\nSpecified amount: \`${amount}\``,
            });

        const UserLevelingData = await UserLeveling.findOne({
            UserID: user.id,
            GuildID: guildId,
        });

        if (!UserLevelingData)
            return interaction.editReply({
                content: `${member.user.username} has not sent any message`,
            });

        UserLevelingData.updateOne({
            $set: {
                XP: amount,
            },
        })
            .then(() => {
                return interaction.editReply({
                    content: `Set **${member.user.username}**'s XP to **${amount}**`,
                });
            })
            .catch((err) => {
                console.log(err);
                return interaction.editReply({
                    content: `There was an error trying to update **${member.user.username}**'s XP`,
                });
            });
    },
};
