import { Guild, Client } from "discord.js";
import GuildLevelingSetting from "../../schemas/guildLevelingSetting";

module.exports = {
    name: "guildDelete",
    friendlyName: "LevelingCreateOnGuildCreate",
    async execute(guild: Guild, client: Client) {
        let GuildLevelingSettingData = await GuildLevelingSetting.findOne({
            GuildID: guild.id,
        });

        if (GuildLevelingSettingData) {
            GuildLevelingSettingData.deleteOne();
        }
    },
};
