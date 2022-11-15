import { ChatInputCommandInteraction, Client } from "discord.js";
import UserLeveling from "../../../schemas/userLeveling";

module.exports = {
    subCommand: "xp.remove",
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

        if (amount > UserLevelingData.XP)
            return interaction.editReply({
                content: `Amount cannot be more than member's xp\nSpecified amount: \`${amount}\` Member's XP: ${UserLevelingData.XP}`,
            });

        UserLevelingData.updateOne({
            $inc: {
                XP: amount * -1,
            },
        })
            .then(() => {
                return interaction.editReply({
                    content: `Removed **${amount}** XP from **${member.user.username}**`,
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
