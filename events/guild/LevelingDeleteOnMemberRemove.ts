import { GuildMember, Client } from "discord.js";
import GuildLevelingSetting from "../../schemas/guildLevelingSetting";
import UserLeveling from "../../schemas/userLeveling";
import UserBlacklist from "../../schemas/userBlacklist";

module.exports = {
    name: "guildMemberRemove",
    friendlyName: "LevelingDeleteOnMemberRemove",
    async execute(member: GuildMember, client: Client) {
        let UserLevelingData = await UserLeveling.findOne({
            UserID: member.user.id,
            GuildID: member.guild.id,
        });

        if (UserLevelingData) {
            UserLevelingData.deleteOne();
        }
    },
};
