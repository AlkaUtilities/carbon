import { Guild, Client, Events } from "discord.js";
import GuildSchema from "../../../schemas/guilds";

/** When the bot is invited to a guild, create a GuildSchema for said guild */
module.exports = {
    name: Events.GuildCreate,
    once: false,
    friendlyName: "NewGuildDatabaseEntry",
    async execute(guild: Guild, client: Client) {
        const guildDocument = await GuildSchema.create({
            GuildID: guild.id,
            Settings: {
                MainRoleID: "000000000000000000",
                Captcha: {
                    Enabled: false,
                    MaxAttempts: 3,
                },
            },
        });

        await guildDocument.save();
    },
};
