import chalk from "chalk";
import {
    GuildChannel,
    Events,
    Collection,
    GuildTextBasedChannel,
} from "discord.js";

import GuildSchema from "../../../schemas/guilds";

const guildRateLimits: Map<string, Map<string, number[]>> = new Collection();

module.exports = {
    name: Events.ChannelCreate,
    friendlyName: "RateLimits.Channel.Create",
    async execute(channel: GuildChannel) {
        // Return if channel is DM
        if (!channel.guild) return console.log("returning, channel is dm");

        const auditLogFetch = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 10, // https://discord-api-types.dev/api/discord-api-types-v10/enum/AuditLogEvent#ChannelCreate
        });

        const entry = auditLogFetch.entries.first();

        if (!entry || !entry.executor) return;

        const userId = entry.executor.id;

        const guild = await GuildSchema.findOne({
            GuildID: channel.guild.id,
        }).select("Settings.RateLimits");

        if (!guild) return;

        const rateLimitWindow =
            (guild.Settings.RateLimits.Channel.Create.Window ||
                guild.Settings.RateLimits.Global.Window) * 1000;

        const rateLimitThreshold =
            guild.Settings.RateLimits.Channel.Create.Limit ||
            guild.Settings.RateLimits.Global.Limit;

        console.log(
            `window: ${rateLimitWindow} | threshold: ${rateLimitThreshold}`
        );

        const now = new Date().getTime();

        // Initialize the guild map if it doesn't exist
        if (!guildRateLimits.has(channel.guild.id)) {
            guildRateLimits.set(channel.guild.id, new Map());
        }

        const userRateLimits = guildRateLimits.get(channel.guild.id) as Map<
            string,
            number[]
        >;

        if (!userRateLimits.has(userId)) {
            userRateLimits.set(userId, [now]);
        } else {
            let channelCreationHistory = userRateLimits.get(userId) as number[];
            channelCreationHistory.push(now);
            userRateLimits.set(userId, channelCreationHistory);
        }

        // Check if the user has exceeded the rate limit within this guild
        if (userRateLimits.has(userId)) {
            const channelCreationHistory = userRateLimits.get(
                userId
            ) as number[];

            // Filter channel creations within the rate limit window
            const recentChannelCreations = channelCreationHistory.filter(
                (timestamp) => now - timestamp < rateLimitWindow
            );

            if (
                recentChannelCreations === undefined ||
                recentChannelCreations?.length === undefined
            )
                return;

            // User exceeded the rate limit
            if (recentChannelCreations.length >= rateLimitThreshold) {
                const report = channel.guild.channels.cache.get(
                    "1018828758569996371"
                ) as GuildTextBasedChannel;

                report!.send({
                    content: `<@${userId}> is exceeding the rate limit.`,
                });
            }

            return;
        }
    },
};
