import { ChatInputCommandInteraction, Client } from "discord.js";
import UserLeveling from "../../../schemas/userLeveling";
import GuildLevelingSetting from "../../../schemas/guildLevelingSetting";

module.exports = {
    subCommand: "xp.give",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        await interaction.deferReply();
        const { options, guild, guildId } = interaction;

        const GuildLevelingSettingData = await GuildLevelingSetting.findOne({
            GuildID: guildId,
        });
        if (!GuildLevelingSettingData || !GuildLevelingSettingData.Enabled) {
            return interaction.editReply({
                content: `**Error**: Leveling is not enabled in this server. Enable it by using \`/leveling toggle\``,
            });
        }

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

        let UserLevelingData = await UserLeveling.findOne({
            UserID: user.id,
            GuildID: guildId,
        });

        if (!UserLevelingData) {
            // return interaction.editReply({
            //     content: `${member.user.username} has not sent any message`,
            // });

            UserLevelingData = await UserLeveling.create({
                UserID: user.id,
                GuildID: guildId,
                XP: amount,
            });

            // do checking here aswell
            return;
        }

        const LevelGoalMultiplier = client.config.userLeveling.required;
        const levelGoal = UserLevelingData.Level * LevelGoalMultiplier;

        if (UserLevelingData.XP + amount >= levelGoal) {
            // if level goal is 100, when calculating after that level goal, the goal would stay on 100
            // e.x. level 1 user given 600, it should levelup the player to level 3, but instead levels it up
            // to 7. Expected: 600 - 100 (lvl 1) = 500 - 200 (lvl 2) = 300 - 300 (lvl 3) = 0;
            // Received: 600 - 100 (lvl 1) = 500 - 100 (lvl 2) = 400 - 100 (lvl 3) = 300 - 100 (lvl 4) = 200
            // - 100 (lvl 5) = 100 - 100 (lvl 6) = 0 - 100??? (lvl 7)

            const levelupAmount = Math.floor(
                (UserLevelingData.XP + amount) / levelGoal
            );
            const remainingXP =
                UserLevelingData.XP + amount - levelupAmount * levelGoal;

            UserLevelingData.updateOne({
                $inc: {
                    Level: levelupAmount,
                },
                $set: {
                    XP: remainingXP,
                },
            })
                .then(() => {
                    return interaction.editReply({
                        content: `Set **${
                            member.user.username
                        }**'s level to **${
                            UserLevelingData?.Level
                                ? UserLevelingData?.Level + levelupAmount
                                : "err"
                        }** and XP to **${remainingXP}**`,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return interaction.editReply({
                        content: `There was an error trying to update **${member.user.username}**'s XP`,
                    });
                });
        } else {
            UserLevelingData.updateOne({
                $inc: {
                    XP: amount,
                },
            })
                .then(() => {
                    return interaction.editReply({
                        content: `Gave **${amount}** XP to **${member.user.username}**`,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return interaction.editReply({
                        content: `There was an error trying to update **${member.user.username}**'s XP`,
                    });
                });
        }
    },
};
