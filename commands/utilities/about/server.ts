import {
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    ChannelType,
    Guild,
} from "discord.js";

module.exports = {
    subCommand: "about.server",
    execute(interaction: ChatInputCommandInteraction, client: Client) {
        const options = interaction.options;
        const ephemeral =
            options.getBoolean("ephemeral") === null
                ? true
                : options.getBoolean("ephemeral", true);
        let guild: Guild;
        if (interaction.guild) guild = interaction.guild;
        else
            return interaction.followUp(
                `You cannot use this command outside of a guild.`
            );
        const verificationLevels = {
            0: "None",
            1: "Low",
            2: "Medium",
            3: "(╯°□°）╯︵ ┻━┻",
            4: "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻",
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
            "en-US": "English US",
            "en-GB": "English GB",
            bg: "Bulgarian",
            "zh-CN": "Chinese CN",
            "zh-TW": "Chinese TW",
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
        const roles = guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map((role) => role.toString());
        const members = guild.members.cache;
        const channels = guild.channels.cache;
        const emojis = guild.emojis.cache;

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
            .setDescription(
                guild.description?.length
                    ? guild.description
                    : "This server has no description."
            )
            .setThumbnail(guild.iconURL({ size: 128 }))
            .setColor("#0390fc")
            .setFooter({
                text: `${interaction.user.username}#${interaction.user.discriminator}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setFields(
                {
                    name: "Overview",
                    value:
                        `Name : \`${guild.name}\`\n` +
                        `ID : ${guild.id}\n` +
                        `Owner : <@${guild.ownerId}>\n` +
                        `Time Created : <t:${guild.createdTimestamp
                            ?.toString()
                            .slice(0, 10)}:f>\n` +
                        `Avatar : [\[Link to avatar\]](${guild.iconURL()})`,
                },
                {
                    name: "Details",
                    value:
                        `Region : ${regions[guild.preferredLocale]}\n` +
                        `Verified : ${
                            guild.verified
                                ? client.icon.true
                                : client.icon.false
                        }\n` +
                        `Partnered : ${
                            guild.partnered
                                ? client.icon.true
                                : client.icon.false
                        }\n` +
                        `AFK Channel : ${
                            guild.afkChannelId
                                ? `<#${guild.afkChannelId}>`
                                : "None"
                        }\n` +
                        `AFK Timeout : ${guild.afkTimeout} seconds\n` +
                        `NSFW Level : ${nsfwLevel[guild.nsfwLevel]}\n` +
                        `Boost tier : ${
                            guild.premiumTier
                                ? `Tier ${guild.premiumTier}`
                                : "None"
                        }`,
                }
            );

        const statsEmbed = new EmbedBuilder()
            .setTitle("Statistics")
            .setThumbnail("https://img.icons8.com/color/344/analytics.png")
            .setColor("#0390fc")
            .setFooter({
                text: `${interaction.user.username}#${interaction.user.discriminator}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
                `Total bans : ${
                    guild.bans.cache.size
                        ? `${guild.bans.cache.size} bans`
                        : "None"
                }\n` +
                    `Total roles : ${guild.roles.cache.size}\n` +
                    `Total boost : ${
                        guild.premiumSubscriptionCount
                            ? guild.premiumSubscriptionCount
                            : "None"
                    }\n` +
                    `Total emojis : ${
                        guild.emojis.cache.size
                            ? guild.emojis.cache.size
                            : "None"
                    }\n` +
                    `Static Emois : ${
                        emojis.filter((emoji) => !emoji.animated).size
                    }\n` +
                    `Animated Emojis : ${
                        emojis.filter((emoji) => emoji.animated).size
                    }\n` +
                    `Members : ${guild.memberCount}\n` +
                    `User : ${
                        members.filter((member) => !member.user.bot).size
                    }\n` +
                    `Bots : ${
                        members.filter((member) => member.user.bot).size
                    }\n` +
                    `Text channels : ${
                        channels.filter(
                            (channel) => channel.type === ChannelType.GuildText
                        ).size
                    }\n` +
                    `News channels : ${
                        channels.filter(
                            (channel) =>
                                channel.type === ChannelType.AnnouncementThread
                        ).size
                    }\n` +
                    `Public thread : ${
                        channels.filter(
                            (channel) =>
                                channel.type === ChannelType.PublicThread
                        ).size
                    }\n` +
                    `Private thread : ${
                        channels.filter(
                            (channel) =>
                                channel.type === ChannelType.PrivateThread
                        ).size
                    }\n` +
                    `Voice channels : ${
                        channels.filter(
                            (channel) => channel.type === ChannelType.GuildVoice
                        ).size
                    }\n` +
                    `Stage channels : ${
                        channels.filter(
                            (channel) =>
                                channel.type === ChannelType.GuildStageVoice
                        ).size
                    }\n` +
                    `Category channels : ${
                        channels.filter(
                            (channel) =>
                                channel.type === ChannelType.GuildCategory
                        ).size
                    }\n` +
                    `Category channels : ${
                        channels.filter(
                            (channel) =>
                                channel.type === ChannelType.GuildCategory
                        ).size
                    }`
            );

        interaction.followUp({
            embeds: [embed, statsEmbed],
            ephemeral: ephemeral,
        });
    },
};
