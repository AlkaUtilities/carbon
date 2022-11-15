import { Message, Client } from "discord.js";
import UserLeveling from "../../schemas/userLeveling";
import GuildSettings from "../../schemas/guildSettings";
import UserBlacklist from "../../schemas/userBlacklist";
import GuildBlacklist from "../../schemas/guildBlacklist";

module.exports = {
    name: "messageCreate",
    friendlyName: "UserLeveling",
    async execute(message: Message, client: Client) {
        const amount = client.config.userLeveling;
        if (message.guild === null || message.author.bot) return;

        const GuildBlacklistData = await GuildBlacklist.findOne({
            GuildID: message.guildId,
        }).catch((err) => {});

        const UserBlacklistData = await UserBlacklist.findOne({
            UserID: message.author.id,
        }).catch((err) => {});

        if (GuildBlacklistData || UserBlacklistData) return;

        let GuildSettingsData = await GuildSettings.findOne({
            GuildID: message.guildId,
        });

        let UserLevelingData = await UserLeveling.findOne({
            GuildID: message.guildId,
            UserID: message.author.id,
        });

        if (!GuildSettingsData) {
            GuildSettingsData = await GuildSettings.create({
                GuildID: message.guildId,
            });
            GuildSettingsData.save();
        }

        const XPIncreaseAmount = Math.round(
            Math.random() * (amount.max - amount.min + 1) +
                amount.min * GuildSettingsData.LevelingXPMultiplier
        );

        if (!UserLevelingData) {
            UserLevelingData = await UserLeveling.create({
                GuildID: message.guildId,
                UserID: message.author.id,
                XP: XPIncreaseAmount,
            });
            UserLevelingData.save();
        } else {
            const LevelupGoal = UserLevelingData.Level * amount.required; // if level is 1, goal is 1 * 100

            // if (UserLevelingData.XP >= LevelupGoal) {
            //     await UserLevelingData.updateOne({
            //         $inc: {
            //             Level: 1,
            //         },
            //         $set: {
            //             XP: XPIncreaseAmount,
            //         },
            //     });
            //     message.channel.send({
            //         content: `GG **${
            //             message.author.username
            //         }**, you just advanced to level **${
            //             UserLevelingData.Level + 1
            //         }**!`,
            //     });
            // } else {

            if (UserLevelingData.XP + XPIncreaseAmount >= LevelupGoal) {
                await UserLevelingData.updateOne({
                    $inc: {
                        Level: 1,
                    },
                    $set: {
                        XP:
                            UserLevelingData.XP +
                            XPIncreaseAmount -
                            LevelupGoal,
                    },
                });
                message.channel.send({
                    content: `GG **${
                        message.author.username
                    }**, you just advanced to level **${
                        UserLevelingData.Level + 1
                    }**!`,
                });
            } else {
                await UserLevelingData.updateOne({
                    $inc: {
                        XP: XPIncreaseAmount,
                    },
                });
            }
        }
    },
};
