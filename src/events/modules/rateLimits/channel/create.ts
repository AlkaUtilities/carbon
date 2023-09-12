import chalk from "chalk";
import {
    GuildChannel,
    Events,
    Collection,
    EmbedBuilder,
    Client,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";

import GuildSchema from "../../../schemas/guilds";

type UserRateLimits = {
    channels: { name: string; createdAt: number }[];
    exceedanceCount: number;
    rateLimitResetTime: number;
};

const guildRateLimits: Collection<
    string,
    Collection<string, UserRateLimits>
> = new Collection();

module.exports = {
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
        }).select("Settings.RateLimits");

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
                    const botHighestRolePosition =
                        channel.guild.members.me?.roles.highest.position || 0;

                    let actionTaken = "None.";

                    const actionTakenReason = `The user attempted to create ${userData.exceedanceCount} more channels after exceeding the rate limit of ${rateLimitThreshold} channels per ${rateLimitWindow} seconds. In total the user created ${recentChannelCreations.length} channels.`;

                    // If user is not a bot (a.k.a. no auto assigned role) and doesnt not have a role that's higher than the bot's highest role
                    if (
                        !member.user.bot &&
                        member.roles.highest.position < botHighestRolePosition
                    ) {
                        // Gets all roles that gives the user permission to create channels
                        // probably not the best idea in scenarios where the member is a bot
                        const staffRoles = member.roles.cache.filter(
                            (r) =>
                                // if role can manage channels (if 'Administrator' is enabled but 'Manage Channel' isnt,
                                // this will still get the role. To disable this behaviour set "checkAdmin" in r.permissions.has() to false)
                                r.permissions.has("ManageChannels", true) &&
                                // if role's position is lower than the bot's highest role position
                                r.position < botHighestRolePosition &&
                                // if member is bot and role name is equal to member's (which is a bot) username
                                !(
                                    member.user.bot &&
                                    r.name === member.user.username
                                )

                            //* if the role is auto assigned and cant be removed, we can instead remove the permission from the role
                            //* but its probably better to just kick/ban the member at this point
                        );

                        await member.roles.remove(
                            staffRoles,
                            actionTakenReason
                        );

                        actionTaken =
                            "All roles containing the *Manage Channels* permission has been removed from the user.";
                    } else if (member.kickable) {
                        await member.kick(actionTakenReason);

                        actionTaken = "User has been kicked from the server.";
                    } else if (member.bannable) {
                        await member.ban({
                            deleteMessageSeconds: 0,
                            reason: actionTakenReason,
                        });

                        actionTaken = "User has been kicked from the server.";
                    }

                    const reportChannel = channel.guild.channels.cache.get(
                        RateLimits.WarningChannelId
                    );

                    if (reportChannel && reportChannel.isTextBased()) {
                        // const iconMatch =
                        // client.icon.security.warning.match(/:(\d{19})>/);

                        const iconURL = undefined;
                        // iconMatch && iconMatch[1]
                        //     ? `https://cdn.discordapp.com/emojis/${iconMatch[1]}.webp`
                        //     : undefined;

                        const embed = new EmbedBuilder()
                            .setAuthor({
                                iconURL: iconURL,
                                name: "Rate Limit Exceeded: Channel create",
                            })
                            .setFields(
                                {
                                    name: "User",
                                    value: `<@${userId}>`,
                                    inline: true,
                                },
                                {
                                    name: "Timestamp",
                                    value: `<t:${recentChannelCreations[0].createdAt
                                        .toString()
                                        .slice(0, -3)}:R>`,
                                    inline: true,
                                },
                                {
                                    name: "\u200b",
                                    value: "\u200b",
                                    inline: true,
                                },
                                {
                                    name: "Rate Limit",
                                    value: `${rateLimitThreshold} channels per ${rateLimitWindow} seconds`,
                                    inline: true,
                                },
                                {
                                    name: "Exceeded",
                                    value: `${userData.exceedanceCount} times`,
                                    inline: true,
                                },
                                {
                                    name: "\u200b",
                                    value: "\u200b",
                                    inline: true,
                                }
                            )
                            .setDescription(actionTaken)
                            .setThumbnail(
                                member.displayAvatarURL({
                                    size: 128,
                                    extension: "webp",
                                })
                            )
                            .setTimestamp()
                            .setColor(client.config.colors.warning);

                        // const kick = new ButtonBuilder()
                        //     .setLabel("Kick")
                        //     .setStyle(ButtonStyle.Danger)
                        //     .setCustomId(`userKick.${user.id}.${now}`);

                        // const ban = new ButtonBuilder()
                        //     .setLabel("Ban")
                        //     .setStyle(ButtonStyle.Danger)
                        //     .setCustomId(`userKick.${user.id}.${now}`);

                        // const actionrow =
                        //     new ActionRowBuilder<ButtonBuilder>().addComponents(
                        //         kick,
                        //         ban
                        //     );

                        await reportChannel.send({
                            embeds: [embed],
                            // components: [actionrow],
                        });
                    }
                }

                /* TODO: (0)
                 * [x] Auto delete channel
                 * [x] Demote user
                 * [ ] Add rate limit exceed penalty (such as increase timer)
                 * [ ] Trigger server lock down when rate limit is exceeded by X times
                 */
            }
        }
    },
};
