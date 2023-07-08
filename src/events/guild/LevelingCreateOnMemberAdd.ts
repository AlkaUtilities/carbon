import { GuildMember, Client } from "discord.js";
import GuildLevelingSetting from "../../schemas/guildLevelingSetting";
import UserLeveling from "../../schemas/userLeveling";
import UserBlacklist from "../../schemas/userBlacklist";

module.exports = {
    name: "guildMemberAdd",
    friendlyName: "LevelingCreateOnMemberAdd",
    async execute(member: GuildMember, client: Client) {
        const GuildLevelingSettingData = await GuildLevelingSetting.findOne({
            GuildID: member.guild.id,
        });

        if (!GuildLevelingSettingData || !GuildLevelingSettingData.Enabled)
            return;

        const UserBlacklistData = await UserBlacklist.findOne({
            UserID: member.user.id,
        });

        if (UserBlacklistData) return;

        let UserLevelingData = await UserLeveling.findOne({
            UserID: member.user.id,
            GuildID: member.guild.id,
        });

        if (!UserLevelingData) {
            UserLevelingData = await UserLeveling.create({
                UserID: member.user.id,
                GuildID: member.guild.id,
            });
        }
    },
};
