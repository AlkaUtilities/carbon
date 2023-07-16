// credits to Kevin Foged (https://github.com/KevinFoged) for the embeds field layout
// GNU General Public License v3.0 - https://www.gnu.org/licenses/gpl-3.0.en.html
// Developed by Kevin Foged, 29th of September 2022 - https://github.com/KevinFoged

import {
    ChannelType,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    Guild,
    Role,
} from "discord.js";

const verificationLevels = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "High", //"(╯°□°）╯︵ ┻━┻",
    4: "Very High", //"┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻",
};
const filterLevels = {
    0: "Off",
    1: "No Role",
    2: "Everyone",
};
const nsfwLevel = {
    0: "Default",
    1: "Explicit",
    2: "Safe",
    3: "Age restricted",
};
const regions = {
    id: "Indonesian",
    "en-US": "EnglishUS",
    "en-GB": "EnglishGB",
    bg: "Bulgarian",
    "zh-CN": "ChineseCN",
    "zh-TW": "ChineseTW",
    hr: "Croatian",
    cs: "Czech",
    da: "Danish",
    nl: "Dutch",
    fi: "Finnish",
    fr: "French",
    de: "German",
    el: "Greek",
    hi: "Hindi",
    hu: "Hungarian",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    lt: "Lithuanian",
    no: "Norwegian",
    pl: "Polish",
    "pt-BR": "PortugueseBR",
    ro: "Romanian",
    ru: "Russian",
    "es-ES": "SpanishES",
    "sv-SE": "Swedish",
    th: "Thai",
    tr: "Turkish",
    uk: "Ukrainian",
    vi: "Vietnamese",
};
const splitPascal = (string: string, separator: string) =>
    string.split(/(?=[A-Z])/).join(separator);

const toPascalCase = (string: string, separator: string) => {
    const pascal =
        string.charAt(0).toUpperCase() +
        string
            .slice(1)
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
    return separator.length ? splitPascal(pascal, separator) : pascal;
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
module.exports = {
    subCommand: "about.server",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        const options = interaction.options;
        const ephemeral = options.getBoolean("ephemeral") ?? true;
        await interaction.deferReply({ ephemeral: ephemeral });
        let guild: Guild;
        if (interaction.guild) guild = interaction.guild;
        else
            return interaction.editReply(
                `You cannot use this command outside of a guild.`
            );

        // const roles = guild.roles
        //     .sort((a, b) => b.position - a.position)
        //     .map((role) => role.toString());
        const roles = guild.roles;
        const sortedRoles = roles.cache
            .map((role) => role)
            .slice(1, roles.cache.size)
            .sort((a, b) => b.position - a.position);
        const userRoles = sortedRoles.filter((role) => !role.managed);
        const managedRoles = sortedRoles.filter((role) => role.managed);
        const members = guild.members.cache;
        const channels = guild.channels.cache;
        const emojis = guild.emojis.cache;

        // const embed = new EmbedBuilder()
        // .setTitle(
        //     `${
        //         interaction.guild.verified
        //             ? client.icon.server.verified + " "
        //             : ""
        //     }${
        //         interaction.guild.partnered
        //             ? client.icon.server.partnered + " "
        //             : ""
        //     } ${guild.name}`
        // )
        // .setDescription(
        //     guild.description?.length
        //         ? guild.description
        //         : "This server has no description."
        // )
        // .setThumbnail(guild.iconURL({ size: 128 }))
        // .setColor("#0390fc")
        // .setFooter({
        //     text: `${interaction.user.username}#${interaction.user.discriminator}`,
        //     iconURL: interaction.user.displayAvatarURL(),
        // })
        // .setFields(
        //     {
        //         name: "Overview",
        //         value:
        //             `Name : \`${guild.name}\`\n` +
        //             `ID : ${guild.id}\n` +
        //             `Owner : <@${guild.ownerId}>\n` +
        //             `Time Created : <t:${guild.createdTimestamp
        //                 ?.toString()
        //                 .slice(0, 10)}:f>\n` +
        //             `Avatar : [\[Link to avatar\]](${guild.iconURL()})`,
        //     },
        //     {
        //         name: "Details",
        //         value:
        //             `Region : ${regions[guild.preferredLocale]}\n` +
        //             `Verified : ${
        //                 guild.verified
        //                     ? client.icon.true
        //                     : client.icon.false
        //             }\n` +
        //             `Partnered : ${
        //                 guild.partnered
        //                     ? client.icon.true
        //                     : client.icon.false
        //             }\n` +
        //             `AFK Channel : ${
        //                 guild.afkChannelId
        //                     ? `<#${guild.afkChannelId}>`
        //                     : "None"
        //             }\n` +
        //             `AFK Timeout : ${guild.afkTimeout} seconds\n` +
        //             `NSFW Level : ${nsfwLevel[guild.nsfwLevel]}\n` +
        //             `Boost tier : ${
        //                 guild.premiumTier
        //                     ? `Tier ${guild.premiumTier}`
        //                     : "None"
        //             }`,
        //     }
        // );

        // const statsEmbed = new EmbedBuilder()
        //     .setTitle("Statistics")
        //     .setThumbnail("https://img.icons8.com/color/344/analytics.png")
        //     .setColor("#0390fc")
        //     .setFooter({
        //         text: `${interaction.user.username}#${interaction.user.discriminator}`,
        //         iconURL: interaction.user.displayAvatarURL(),
        //     })
        //     .setDescription(
        //         `Total bans : ${
        //             guild.bans.cache.size
        //                 ? `${guild.bans.cache.size} bans`
        //                 : "None"
        //         }\n` +
        //             `Total roles : ${guild.roles.cache.size}\n` +
        //             `Total boost : ${
        //                 guild.premiumSubscriptionCount
        //                     ? guild.premiumSubscriptionCount
        //                     : "None"
        //             }\n` +
        //             `Total emojis : ${
        //                 guild.emojis.cache.size
        //                     ? guild.emojis.cache.size
        //                     : "None"
        //             }\n` +
        //             `Static Emois : ${
        //                 emojis.filter((emoji) => !emoji.animated).size
        //             }\n` +
        //             `Animated Emojis : ${
        //                 emojis.filter((emoji) => emoji.animated).size
        //             }\n` +
        //             `Members : ${guild.memberCount}\n` +
        //             `User : ${
        //                 members.filter((member) => !member.user.bot).size
        //             }\n` +
        //             `Bots : ${
        //                 members.filter((member) => member.user.bot).size
        //             }\n` +
        //             `Text channels : ${
        //                 channels.filter(
        //                     (channel) => channel.type === ChannelType.GuildText
        //                 ).size
        //             }\n` +
        //             `News channels : ${
        //                 channels.filter(
        //                     (channel) =>
        //                         channel.type === ChannelType.AnnouncementThread
        //                 ).size
        //             }\n` +
        //             `Public thread : ${
        //                 channels.filter(
        //                     (channel) =>
        //                         channel.type === ChannelType.PublicThread
        //                 ).size
        //             }\n` +
        //             `Private thread : ${
        //                 channels.filter(
        //                     (channel) =>
        //                         channel.type === ChannelType.PrivateThread
        //                 ).size
        //             }\n` +
        //             `Voice channels : ${
        //                 channels.filter(
        //                     (channel) => channel.type === ChannelType.GuildVoice
        //                 ).size
        //             }\n` +
        //             `Stage channels : ${
        //                 channels.filter(
        //                     (channel) =>
        //                         channel.type === ChannelType.GuildStageVoice
        //                 ).size
        //             }\n` +
        //             `Category channels : ${
        //                 channels.filter(
        //                     (channel) =>
        //                         channel.type === ChannelType.GuildCategory
        //                 ).size
        //             }\n` +
        //             `Category channels : ${
        //                 channels.filter(
        //                     (channel) =>
        //                         channel.type === ChannelType.GuildCategory
        //                 ).size
        //             }`
        //     );

        const embed = new EmbedBuilder()
            .setTitle(
                `${
                    interaction.guild.verified
                        ? client.icon.server.verified + " "
                        : ""
                }${
                    interaction.guild.partnered
                        ? client.icon.server.partnered + " "
                        : ""
                } ${guild.name}`
            )
            .setThumbnail(guild.iconURL({ size: 1024 }))
            .setImage(guild.bannerURL({ size: 1024 }))
            .setColor("#0390fc")
            .setFields(
                {
                    name: "Description",
                    value: guild.description || "None",
                },
                {
                    name: "Overview",
                    // inline: true,
                    value: [
                        `**ID**: ${guild.id}`,
                        `**Owner**: <@${guild.ownerId}>`,
                        `**Time Created**: <t:${guild.createdTimestamp
                            ?.toString()
                            .slice(0, 10)}:f>`,
                        `**Icon**: ${
                            guild.iconURL()
                                ? `[\[Link to icon\]](${guild.iconURL()})`
                                : "None"
                        }`,
                        `**Region**: ${regions[guild.preferredLocale]}`,
                        `**Vanity URL**: ${guild.vanityURLCode || "None"}`,
                    ].join("\n"),
                },
                {
                    name: "Features",
                    inline: true,
                    value:
                        guild.features
                            .map((f) => `\- ${toPascalCase(f, " ")}`)
                            .join("\n") || "Nones",
                },
                {
                    name: "Safety Setup",
                    inline: true,
                    value: [
                        `**Explicit FIlter**: ${
                            filterLevels[guild.explicitContentFilter]
                        }`,
                        `**NSFW Level**: ${nsfwLevel[guild.nsfwLevel]}`,
                        `**Verification Level**: ${
                            verificationLevels[guild.verificationLevel]
                        }`,
                    ].join("\n"),
                },
                {
                    name: "Members",
                    inline: true,
                    value: [
                        `**Total**: ${guild.memberCount}`,
                        `**Users**: ${members.filter((m) => !m.user.bot).size}`,
                        `**Bots**: ${members.filter((m) => m.user.bot).size}`,
                    ].join("\n"),
                },
                {
                    name: `**User Roles** (showing ${maxDisplayRoles(
                        userRoles
                    )} of ${userRoles.length}):`,
                    value:
                        userRoles
                            .slice(0, maxDisplayRoles(userRoles))
                            .join(" ") || "None",
                },
                {
                    name: `**Managed Roles** (showing ${maxDisplayRoles(
                        managedRoles
                    )} of ${managedRoles.length}):`,
                    value:
                        managedRoles
                            .slice(0, maxDisplayRoles(managedRoles))
                            .join(" ") || "None",
                },
                {
                    name: "Channels",
                    inline: true,
                    value: [
                        `**Text**: ${
                            channels.filter(
                                (c) => c.type === ChannelType.GuildText
                            ).size
                        }`,
                        `**Voice**: ${
                            channels.filter(
                                (c) => c.type === ChannelType.GuildVoice
                            ).size
                        }`,
                        `**Thread**: ${
                            channels.filter(
                                (c) => c.type === ChannelType.PublicThread
                            ).size +
                            channels.filter(
                                (c) => c.type === ChannelType.PrivateThread
                            ).size +
                            channels.filter(
                                (c) => c.type === ChannelType.AnnouncementThread
                            ).size
                        }`,
                        `**Categories**: ${
                            channels.filter(
                                (c) => c.type === ChannelType.GuildText
                            ).size
                        }`,
                    ].join("\n"),
                },
                {
                    name: "Emojis & Stickers",
                    inline: true,
                    value: [
                        `**Static**: ${emojis.filter((e) => !e.animated).size}`,
                        `**Animated**: ${
                            emojis.filter((e) => e.animated).size
                        }`,
                        `**Stickers**: ${guild.stickers.cache.size}`,
                    ].join("\n"),
                },
                {
                    name: "Nitro",
                    inline: true,
                    value: [
                        `**Tier**: ${guild.premiumTier || "None"}`,
                        `**Boosts**: ${
                            guild.premiumSubscriptionCount || "None"
                        }`,
                        `**Boosters**: ${
                            members.filter((m) => m.roles.premiumSubscriberRole)
                                .size
                        }`,
                        `**Total Boosters**: ${
                            members.filter((m) => m.premiumSince).size
                        }`,
                    ].join("\n"),
                },
                { name: "Banner", value: guild.bannerURL() ? `\u200b` : "None" }
            );

        interaction.editReply({
            embeds: [embed],
        });
    },
};
