import chalk from "chalk";
import {
    GuildChannel,
    Events,
    Collection,
    Client,
    PermissionResolvable,
    PermissionsBitField,
} from "discord.js";

import { takeActionOnRateLimitExceedence } from "../functions";

import GuildSchema from "../../../../schemas/guilds";

type UserRateLimits = {
    channels: { name: string; createdAt: number }[];
    exceedanceCount: number;
    rateLimitResetTime: number;
};

const guildRateLimits: Collection<
    string,
    Collection<string, UserRateLimits>
> = new Collection();

export const event = {
    name: Events.ChannelCreate,
    friendlyName: "RateLimits.Channel.Create",
    async execute(channel: GuildChannel, client: Client) {
        // Return if channel is DM
        if (!channel.guild) return;

        // :/
        const auditLogFetch = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 10, // https://discord-api-types.dev/api/discord-api-types-v10/enum/AuditLogEvent#ChannelCreate
        });

        const entry = auditLogFetch.entries.first();

        if (!entry || !entry.executor) return;

        const userId = entry.executor.id;
        const member = channel.guild.members.cache.get(userId);

        if (!member) return;

        const guild = await GuildSchema.findOne({
            GuildID: channel.guild.id,
        }).select(
            "Settings.RateLimits.Channel.Create Settings.RateLimits.Global"
        );

        if (!guild) return;

        const RateLimits = guild.Settings.RateLimits;

        const rateLimitWindow =
            RateLimits.Channel.Create.Window || RateLimits.Global.Window;

        const rateLimitWindowMS = rateLimitWindow * 1000;

        const rateLimitThreshold =
            RateLimits.Channel.Create.Limit || RateLimits.Global.Limit;

        const now = new Date().getTime();

        // Initialize the guild collection if it doesn't exist
        if (!guildRateLimits.has(channel.guild.id)) {
            guildRateLimits.set(channel.guild.id, new Collection());
        }

        const userRateLimits = guildRateLimits.get(
            channel.guild.id
        ) as Collection<string, UserRateLimits>;

        // Check if the user has a rate limit entry and reset it if necessary
        if (userRateLimits.has(userId)) {
            const userData = userRateLimits.get(userId) as UserRateLimits;

            // Check if the rate limit should be reset
            if (now - userData.rateLimitResetTime >= rateLimitWindowMS) {
                userRateLimits.delete(userId);
            }
        }

        // Initialize the user collection
        if (!userRateLimits.has(userId)) {
            userRateLimits.set(userId, {
                channels: [{ name: channel.name, createdAt: now }],
                exceedanceCount: 0,
                rateLimitResetTime: now,
            });
        } else {
            let userData = userRateLimits.get(userId) as UserRateLimits;
            userData.channels.push({ name: channel.name, createdAt: now });
            userRateLimits.set(userId, userData);
        }

        // Check if the user has exceeded the rate limit within this guild
        if (userRateLimits.has(userId)) {
            const userData = userRateLimits.get(userId) as UserRateLimits;

            // Filter channel creations within the rate limit window
            const recentChannelCreations = userData.channels.filter(
                (channel) => now - channel.createdAt < rateLimitWindowMS
            );

            if (
                recentChannelCreations === undefined ||
                recentChannelCreations?.length === undefined
            )
                return;

            // User exceeded the rate limit
            if (recentChannelCreations.length >= rateLimitThreshold) {
                // Increment exceedance count
                userData.exceedanceCount++;

                if (channel.deletable)
                    await channel.delete(
                        "Channel creator was rate limited when this channel was created."
                    );

                if (userData.exceedanceCount >= 5) {
                    const actionName = "Channel Create";
                    const rateLimit = `${rateLimitThreshold} channels per ${rateLimitWindow} seconds`;
                    const timestamp = `<t:${recentChannelCreations[0].createdAt
                        .toString()
                        .slice(0, -3)}:R>`;
                    const actionTakenAgainstUserReason = `The user attempted to create ${userData.exceedanceCount} more channels after exceeding the rate limit of ${rateLimitThreshold} channels per ${rateLimitWindow} seconds. In total the user created ${recentChannelCreations.length} channels.`;
                    const staffRolePermission: PermissionResolvable =
                        PermissionsBitField.Flags.ManageChannels;

                    return await takeActionOnRateLimitExceedence(
                        client,
                        channel.guild,
                        member,
                        actionTakenAgainstUserReason,
                        actionName,
                        rateLimit,
                        timestamp,
                        userData.exceedanceCount,
                        staffRolePermission,
                        RateLimits.WarningChannelId,
                        channel.guild.members.me?.roles.highest.position
                    );
                }
            }

            /* TODO: (0)
             * [x] Auto delete channel
             * [x] Demote user
             * [ ] Add rate limit exceed penalty (such as increase timer)
             * [ ] Trigger server lock down when rate limit is exceeded by X times
             */
        }
    },
};
