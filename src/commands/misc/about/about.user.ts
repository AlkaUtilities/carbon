import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Client,
    Role,
    ActivityType,
} from "discord.js";
import UserBlacklist from "../../../schemas/userBlacklist";

const formatting = {
    flagsCode: {
        BugHunterLevel1: "Bug Hunter Level 1",
        BugHunterLevel2: "Bug Hunter Level 2",
        CertifiedModerator: "Certified Moderator",
        HypeSquadOnlineHouse1: "House Bravery Member",
        HypeSquadOnlineHouse2: "House Brilliance Member",
        HypeSquadOnlineHouse3: "House Balance Member",
        Hypesquad: "HypeSquad Events Member",
        Partner: "Partnered Server Owner",
        PremiumEarlySupporter: "Early Nitro Supporter",
        Staff: "Discord Employee",
        TeamPseudoUser: "Team Pseudo",
        VerifiedBot: "Verified Bot",
        VerifiedDeveloper: "Verified Developer",
        // unstable
        Quarantined: "Quarantined",
        Spammer: "Spammer",
    },
    flags: {
        BugHunterLevel1: "<:bughunter_lvl1:1010556670281265152>",
        BugHunterLevel2: "<:bughunter_lvl2:1010556662232383548>",
        CertifiedModerator: "<:certified_moderator:1010556793304395847>",
        HypeSquadOnlineHouse1: "<:hypesquad_bravery:1010556438063616142>",
        HypeSquadOnlineHouse2: "<:hypesquad_brilliance:1010556402097471559>",
        HypeSquadOnlineHouse3: "<:hypesquad_balance:1010556399350194196>",
        Hypesquad: "<:hypesquad_event:1010556421970079905> ",
        Partner: "<:partnered_server_owner:1010556779450613810>",
        PremiumEarlySupporter: "<:early_supporter:1010556776573317173>",
        Staff: "<:employee:1010558705898627125>",
        VerifiedDeveloper:
            "<:early_verified_bot_developer:1010557509938982933>",
    },
    userStatus: {
        online: "<:online:1010472659743670283>Online",
        idle: "<:idle:1010472641020305448>Idle",
        dnd: "<:dnd:1010472622322090076>Do Not Disturb",
        offline: "<:offline:1010472611987333180>Offline",
        invisible: "<:offline:1010472611987333180>Offline",
    },
    userActivityType: {
        0: "**Playing**",
        1: "**Streaming**",
        2: "**Listening to**",
        3: "**Watching**",
        4: "**Custom**",
        5: "**Competing in**",
    },
    platformIcon: {
        desktop: "<:platform_desktop:1012667505405345822> Desktop",
        mobile: "<:platform_mobile:1012667508328767518> Mobile",
        web: "<:platform_web:1012667510212018189> Web",
    },
};

module.exports = {
    subCommand: "about.user",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        const options = interaction.options;
        const ephemeral = options.getBoolean("ephemeral") ?? true;
        await interaction.deferReply({ ephemeral: ephemeral });
        const user = options.getUser("user", true);
        const member = interaction.guild?.members.cache.get(user.id);
        if (!member)
            return interaction.editReply({
                content: `Unable to find member.`,
            });

        let UserBlacklistData: any;

        try {
            UserBlacklistData = await UserBlacklist.findOne({
                UserID: user.id,
            });
        } catch (err) {
            console.log(err);
        }

        let userf = {
            status: "",
            failedChecks: [],
            namePrefix: "",
            nameSuffix: "",
            roles: member.roles.cache
                .map((role) => role) //role.toString())
                .sort((a, b) => b.position - a.position)
                .slice(0, member.roles.cache.size - 1),
            flags: (user.flags || (await user.fetchFlags())).toArray(),
            presence: member.presence,
            activity: member.presence?.activities
                .filter((activity) => activity.type !== ActivityType.Custom) // ignore custom
                .map(
                    (activity) =>
                        `${formatting.userActivityType[activity.type]} ${
                            activity.name
                        }${activity.url ? ` [\[URL\]](${activity.url})` : ""}`
                )
                .join("\n"),
        };

        const maxDisplayRoles = (roles: Role[], maxFieldLength = 1024) => {
            let totalLength = 0;
            const result = [];

            for (const role of roles) {
                const roleString = `<@&${role.id}>`;

                if (roleString.length + totalLength > maxFieldLength) break;

                totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
                result.push(roleString);
            }

            return result.length;
        };

        // Check if user is in blacklist
        if (!UserBlacklistData) {
            // userf.status = `${client.icon.db.normal} Not blacklisted`;
            userf.status = `${client.icon.blacklist.notfound} Not found`;
        } else {
            // userf.status = `${client.icon.db.blacklisted} Blacklisted`;
            userf.status = `${client.icon.blacklist.found} Found`;
        }

        /* Constructs the name prefix */
        // if (userData?.namePrefix) { // check if 'namePrefix' is declared in userData, if yes set userf.namePrefix to it.
        //     userf.namePrefix = userf.namePrefix + ' ' + userData.namePrefix;
        // };

        if (
            client.config.developersId.includes(user.id) &&
            !userf.namePrefix.includes(client.icon.bot.developer)
        ) {
            // check if developersId includes user.id, if true check if it doesnt have the badge on the prefix already, if not add one.
            userf.namePrefix =
                userf.namePrefix + " " + client.icon.bot.developer;
        }
        if (
            user.bot &&
            client.config.alka.bots.includes(user.id) &&
            !userf.namePrefix.includes(client.icon.alka.bot)
        ) {
            // check if user is bot, if yes check if user.id is included in config.alka.bot, if true check if it doesnt have the badge on the prefix already, if not add one.
            userf.namePrefix = userf.namePrefix + " " + client.icon.alka.bot;
        }
        if (user.id === interaction.guild?.ownerId) {
            // check if user is server owner, if yes add server owner badge
            userf.namePrefix =
                userf.namePrefix + " " + client.icon.server.owner;
        }

        /* Constructs the name suffix */
        // if (userData?.nameSuffix) {
        //     userf.nameSuffix = userf.nameSuffix + userData.nameSuffix;
        // };

        const embed = new EmbedBuilder()
            .setTitle(
                `${userf.namePrefix.length ? `${userf.namePrefix} ` : ""}${
                    user.username
                }${user.discriminator !== "0" ? `#${user.discriminator}` : ""}${
                    userf.nameSuffix.length ? ` ${userf.nameSuffix}` : ""
                }`
            )
            .setThumbnail(user.displayAvatarURL())
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor(
                member.roles.hoist?.hexColor || user.hexAccentColor || "#0390fc"
            )
            .setFields(
                {
                    name: `User`,
                    value: [
                        `**Username**: ${user.username}`,
                        `**Discriminator**: ${user.discriminator}`,
                        `**ID**: \`${user.id}\``,
                        `**Time Created**: <t:${user.createdTimestamp
                            ?.toString()
                            .slice(0, 10)}:f>`,
                        `**Avatar**: [\[Display avatar\]](${user.displayAvatarURL()}) [\[Default avatar\]](${
                            user.defaultAvatarURL
                        })`,
                        `**User Color**: ${user.hexAccentColor || "None"}`,
                        `**Bot**: ${
                            user.bot
                                ? `${client.icon.true} True`
                                : `${client.icon.false} False`
                        }`,
                        `**Flags**: ${
                            userf.flags.length
                                ? userf.flags
                                      .map((flag) =>
                                          (formatting.flags as any)[flag]
                                              ? (formatting.flags as any)[
                                                    flag
                                                ] + " "
                                              : (formatting.flagsCode as any)[
                                                    flag
                                                ]
                                      )
                                      .join(", ")
                                : "None"
                        }`,
                        `**Status**: ${
                            userf.presence
                                ? (formatting.userStatus as any)[
                                      userf.presence.status
                                  ]
                                : `Unable to fetch user presence`
                        }`,
                        `**Platform**: ${
                            userf.presence
                                ? userf.presence.clientStatus
                                    ? userf.presence.clientStatus.desktop
                                        ? (formatting.platformIcon as any)[
                                              "desktop"
                                          ]
                                        : userf.presence.clientStatus.web
                                        ? (formatting.platformIcon as any)[
                                              "web"
                                          ]
                                        : userf.presence.clientStatus.mobile
                                        ? (formatting.platformIcon as any)[
                                              "mobile"
                                          ]
                                        : `Unknown`
                                    : `Unable to fetch user platform`
                                : `Unable to fetch user presence`
                        }`,
                        `**Activity**: \n${userf.activity || "None"}`,
                    ].join("\n"),
                },
                {
                    name: "Member",
                    value: [
                        `**Nickname**: ${
                            member.nickname
                                ? `\`${member.nickname}\``
                                : "Same as username"
                        }`,
                        `**Server Join Date**: <t:${member.joinedTimestamp
                            ?.toString()
                            .slice(0, 10)}:f>`,
                        `**Server Owner**:  ${
                            user.id === interaction.guild?.ownerId
                                ? `${client.icon.true} True`
                                : `${client.icon.false} False`
                        }`,
                        `**Pending**: ${
                            member.pending
                                ? `${client.icon.true} True`
                                : `${client.icon.false} False`
                        }`,
                        `**Hoist role**: ${
                            userf.roles
                                ? member.roles.hoist
                                    ? `${member.roles.hoist} (${member.roles.hoist.hexColor})`
                                    : "None"
                                : "Member has no role"
                        }`,
                        // `**Roles** (showing ${
                        //     userf.roles.length > 1
                        //         ? maxDisplayRoles(userf.roles) +
                        //           " of " +
                        //           userf.roles.length
                        //         : userf.roles.length
                        // }): \n${
                        //     // userf.roles.length ? userf.roles.join("\n") : "None"
                        //     userf.roles.length
                        //         ? userf.roles
                        //               .slice(0, maxDisplayRoles(userf.roles))
                        //               .join("\n")
                        //         : "None"
                        // }`,
                    ].join("\n"),
                    inline: true,
                },
                // {
                //     name: "Moderation",
                //     value: [
                //         `**Managable**: ${
                //             member.manageable
                //                 ? `${client.icon.true} True`
                //                 : `${client.icon.false} False`
                //         }`,
                //         `**Moderatable**: ${
                //             member.moderatable
                //                 ? `${client.icon.true} True`
                //                 : `${client.icon.false} False`
                //         }`,
                //         `**Kickable**: ${
                //             member.kickable
                //                 ? `${client.icon.true} True`
                //                 : `${client.icon.false} False`
                //         }`,
                //         `**Bannable**: ${
                //             member.bannable
                //                 ? `${client.icon.true} True`
                //                 : `${client.icon.false} False`
                //         }\n`,
                //     ].join("\n"),
                //     inline: true,
                // },
                {
                    name: `Roles (showing ${
                        userf.roles.length > 1
                            ? maxDisplayRoles(userf.roles) +
                              " of " +
                              userf.roles.length
                            : userf.roles.length
                    })`,
                    value: userf.roles.length
                        ? userf.roles
                              .slice(0, maxDisplayRoles(userf.roles))
                              .join(" ")
                        : "None",
                },
                {
                    name: "Alka Utilities",
                    value:
                        // `Database: ${userData ? `${client.icon.true} Registered` : `${client.icon.false} Not registered`}`,
                        `**Blacklist**: ${userf.status}`,
                }
            );
        return interaction.editReply({ embeds: [embed] });
    },
};
