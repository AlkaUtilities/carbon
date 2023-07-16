import { Message, Client } from "discord.js";
import UserLeveling from "../../schemas/userLeveling";
import GuildLevelingSetting from "../../schemas/guildLevelingSetting";
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

        let GuildLevelingSettingData = await GuildLevelingSetting.findOne({
            GuildID: message.guildId,
        });

        let UserLevelingData = await UserLeveling.findOne({
            GuildID: message.guildId,
            UserID: message.author.id,
        });

        if (!GuildLevelingSettingData) {
            GuildLevelingSettingData = await GuildLevelingSetting.create({
                GuildID: message.guildId,
                Enabled: false,
            });
            return;
        } else if (GuildLevelingSettingData.Enabled !== true) return;

        const XPIncreaseAmount = Math.round(
            (Math.random() * (amount.max - amount.min + 1) + amount.min) *
                GuildLevelingSettingData.XPMultiplier
        );

        const update = Date.now();

        if (!UserLevelingData) {
            UserLevelingData = await UserLeveling.create({
                GuildID: message.guildId,
                UserID: message.author.id,
                XP: XPIncreaseAmount,
                LastXPInc: update,
            });
            return;
        }

        // xp increment interval
        if (
            update - UserLevelingData.LastXPInc <
            GuildLevelingSettingData.XPIncrementInterval * 1000
        )
            return;

        const LevelupGoal = UserLevelingData.Level * amount.required; // if level is 2, goal is 2 * 100

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
                    XP: UserLevelingData.XP + XPIncreaseAmount - LevelupGoal,
                    LastXPInc: update,
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
            // LastXPInc MUST be $set and NOT $inc
            await UserLevelingData.updateOne({
                $set: {
                    LastXPInc: update,
                },
                $inc: {
                    XP: XPIncreaseAmount,
                },
            });
        }
    },
};
