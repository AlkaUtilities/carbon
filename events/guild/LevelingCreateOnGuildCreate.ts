import { Guild, Client } from "discord.js";
import GuildLevelingSetting from "../../schemas/guildLevelingSetting";
import GuildBlacklist from "../../schemas/guildBlacklist";

module.exports = {
    name: "guildCreate",
    friendlyName: "LevelingCreateOnGuildCreate",
    async execute(guild: Guild, client: Client) {
        const GuildBlacklistData = await GuildBlacklist.findOne({
            GuildID: guild.id,
        });

        if (GuildBlacklistData) return;

        let GuildLevelingSettingData = await GuildLevelingSetting.findOne({
            GuildID: guild.id,
        });

        if (!GuildLevelingSettingData) {
            GuildLevelingSettingData = await GuildLevelingSetting.create({
                GuildID: guild.id,
            });
        }
    },
};
