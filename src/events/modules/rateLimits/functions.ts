import {
    Client,
    Guild,
    GuildMember,
    PermissionResolvable,
    EmbedBuilder,
} from "discord.js";

/**
 * Function to handle users who exceeds the rate limit more than X amount of time.
 * @param client Client
 * @param guild Guild
 * @param member Member
 * @param actionTakenAgainstUserReason Reason for taking action against the user (removing staff roles, kicking, or banning)
 * @param actionName The name of the action (for example: "Channel Create")
 * @param rateLimit The rate limit (for example: "5 channels per 60 seconds")
 * @param timestamp The time when the rate limit is exceeded
 * @param exceedanceCount How much the rate limit was exceeded
 * @param staffRolePermission Roles with this permission will be removed from the user if the user isn't a bot and has a highest role position that is lower role position that the bot's highest role position
 * @param warningChannelId The channel the report will be sent to. If invalid, the report will not be sent
 * @param botHighestRolePosition Bot's highest role position (default: `0`)
 */
export async function takeActionOnRateLimitExceedence(
    client: Client,
    guild: Guild,
    member: GuildMember,
    actionTakenAgainstUserReason: string,
    actionName: string,
    rateLimit: string,
    timestamp: string,
    exceedanceCount: number,
    staffRolePermission: PermissionResolvable,
    warningChannelId: string,
    botHighestRolePosition: number = 0
) {
    let actionTaken = "None.";

    // const actionTakenAgainstUserReason = `The user attempted to create ${userData.exceedanceCount} more channels after exceeding the rate limit of ${rateLimitThreshold} channels per ${rateLimitWindow} seconds. In total the user created ${recentChannelCreations.length} channels.`;

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
                r.permissions.has(staffRolePermission, true) &&
                // if role's position is lower than the bot's highest role position
                r.position < botHighestRolePosition &&
                // if member is bot and role name is equal to member's (which is a bot) username
                !(member.user.bot && r.name === member.user.username)

            //* if the role is auto assigned and cant be removed, we can instead remove the permission from the role
            //* but its probably better to just kick/ban the member at this point
        );

        await member.roles.remove(staffRoles, actionTakenAgainstUserReason);

        actionTaken =
            "All roles containing the *Manage Channels* permission has been removed from the user.";
    } else if (member.kickable) {
        await member.kick(actionTakenAgainstUserReason);

        actionTaken = "User has been kicked from the server.";
    } else if (member.bannable) {
        await member.ban({
            deleteMessageSeconds: 0,
            reason: actionTakenAgainstUserReason,
        });

        actionTaken = "User has been kicked from the server.";
    }

    const reportChannel = guild.channels.cache.get(warningChannelId);

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
                name: `Rate Limit Exceeded: ${actionName}`,
            })
            .setFields(
                {
                    name: "User",
                    value: `<@${member.user.id}>`,
                    inline: true,
                },
                {
                    name: "Timestamp",
                    value: timestamp,
                    inline: true,
                },
                {
                    name: "\u200b",
                    value: "\u200b",
                    inline: true,
                },
                {
                    name: "Rate Limit",
                    value: rateLimit,
                    inline: true,
                },
                {
                    name: "Exceeded",
                    value: `${exceedanceCount} times`,
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
