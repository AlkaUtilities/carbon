import { ChatInputCommandInteraction, EmbedBuilder, Client } from "discord.js";
import UserBlacklist from "../../../schemas/userBlacklist";

module.exports = {
    subCommand: "about.user",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        const options = interaction.options;
        const user = options.getUser("user", true);
        const member = interaction.guild?.members.cache.get(user.id);
        const ephemeral =
            options.getBoolean("ephemeral") === null
                ? true
                : options.getBoolean("ephemeral", true);
        if (!member)
            return interaction.followUp({
                content: `Unable to find member.`,
                ephemeral: true,
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
                .sort((a, b) => b.position - a.position)
                .map((role) => role.toString())
                .slice(0, -1),
            flags: (user.flags || (await user.fetchFlags())).toArray(),
            presence: member.presence,
        };

        console.log(userf.flags);

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
                CertifiedModerator:
                    "<:certified_moderator:1010556793304395847>",
                HypeSquadOnlineHouse1:
                    "<:hypesquad_bravery:1010556438063616142>",
                HypeSquadOnlineHouse2:
                    "<:hypesquad_brilliance:1010556402097471559>",
                HypeSquadOnlineHouse3:
                    "<:hypesquad_balance:1010556399350194196>",
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
                0: "**PLAYING**",
                1: "**STREAMING**",
                2: "**LISTENING**",
                3: "**WATCHING**",
                4: "**CUSTOM**",
                5: "**COMPETING**",
            },
            platformIcon: {
                desktop: "<:platform_desktop:1012667505405345822> Desktop",
                mobile: "<:platform_mobile:1012667508328767518> Mobile",
                web: "<:platform_web:1012667510212018189> Web",
            },
        };

        // Check if user is in blacklist
        if (!UserBlacklistData) {
            // userf.status = `${client.icon.db.normal} Not blacklisted`;
            userf.status = `${client.icon.db.normal} Not found`;
        } else {
            // userf.status = `${client.icon.db.blacklisted} Blacklisted`;
            userf.status = `${client.icon.db.blacklisted} Found`;
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
                }#${user.discriminator}${
                    userf.nameSuffix.length ? ` ${userf.nameSuffix}` : ""
                }`
            )
            .setThumbnail(user.displayAvatarURL())
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor(member.roles.hoist?.hexColor || "#0390fc")
            .setFields(
                {
                    name: `User`,
                    value:
                        `Username : ${user.username}\n` +
                        `Discriminator : ${user.discriminator}\n` +
                        `ID : \`${user.id}\`\n` +
                        `Time Created : <t:${user.createdTimestamp
                            ?.toString()
                            .slice(0, 10)}:f>\n` +
                        `Avatar: [\[Display avatar\]](${user.displayAvatarURL()}) [\[Default avatar\]](${
                            user.defaultAvatarURL
                        })\n` +
                        `Bot : ${
                            user.bot
                                ? `${client.icon.true} True`
                                : `${client.icon.false} False`
                        }\n` +
                        `Flags : ${
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
                        }\n` +
                        `Status : ${
                            userf.presence
                                ? (formatting.userStatus as any)[
                                      userf.presence.status
                                  ]
                                : `Unable to fetch user presence`
                        }\n` +
                        `Platform : ${
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
                        }\n` +
                        `Activity : ${
                            userf.presence
                                ? userf.presence?.activities.length
                                    ? userf.presence?.activities
                                          .map(
                                              (activity) =>
                                                  formatting.userActivityType[
                                                      activity.type
                                                  ] +
                                                  " " +
                                                  activity.name +
                                                  (activity.url
                                                      ? ` [\[URL\]](${activity.url})`
                                                      : "")
                                          )
                                          .join(", ")
                                    : "None"
                                : "Unable to fetch user presence"
                        }`,
                },
                {
                    name: "Member",
                    value:
                        `Nickname : ${
                            member.nickname
                                ? `\`${member.nickname}\``
                                : "Same as username"
                        }\n` +
                        `Server Join Date : <t:${member.joinedTimestamp
                            ?.toString()
                            .slice(0, 10)}:f>\n` +
                        `Server Owner :  ${
                            user.id === interaction.guild?.ownerId
                                ? `${client.icon.true} True`
                                : `${client.icon.false} False`
                        }\n` +
                        `Pending : ${
                            member.pending
                                ? `${client.icon.true} True`
                                : `${client.icon.false} False`
                        }\n` +
                        `Hoist role : ${
                            userf.roles
                                ? member.roles.hoist
                                    ? `${member.roles.hoist} (#${member.roles.hoist.hexColor})`
                                    : "None"
                                : "Member has no role"
                        }\n` +
                        `Roles (${userf.roles.length}) : \n${
                            userf.roles.length ? userf.roles.join("\n") : "None"
                        }`,
                    inline: true,
                },
                {
                    name: "Moderation",
                    value:
                        `Managable : ${
                            member.manageable
                                ? `${client.icon.true} True`
                                : `${client.icon.false} False`
                        }\n` +
                        `Moderatable : ${
                            member.moderatable
                                ? `${client.icon.true} True`
                                : `${client.icon.false} False`
                        }\n` +
                        `Kickable : ${
                            member.kickable
                                ? `${client.icon.true} True`
                                : `${client.icon.false} False`
                        }\n` +
                        `Bannable : ${
                            member.bannable
                                ? `${client.icon.true} True`
                                : `${client.icon.false} False`
                        }\n`,
                    inline: true,
                },
                {
                    name: "Alka Utilities",
                    value:
                        // `Database: ${userData ? `${client.icon.true} Registered` : `${client.icon.false} Not registered`}\n` +
                        `Blacklist: ${userf.status}`,
                }
            );

        return interaction.followUp({ embeds: [embed], ephemeral: ephemeral });
    },
};
