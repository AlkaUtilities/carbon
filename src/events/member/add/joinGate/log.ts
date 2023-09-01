import {
    GuildMember,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import GuildSchema from "../../../../schemas/guilds";

module.exports = {
    name: "guildMemberAdd",
    once: false,
    friendlyName: "JoinGateLog",
    async execute(member: GuildMember, client: Client) {
        const guild = await GuildSchema.findOne({ GuildID: member.guild.id });

        if (!guild) return;

        const module = guild.Settings?.Modules?.JoinGate?.LogUser;

        if (!module?.Enabled || !module.ChannelID) return;

        const channel = member.guild.channels.cache.get(module.ChannelID);

        if (!channel || !channel.isTextBased()) return;

        const embed = new EmbedBuilder()
            .setColor("#2f3136")
            .setThumbnail(
                member.user.displayAvatarURL({
                    extension: "webp",
                    size: 128,
                })
            )
            .setTimestamp()
            .setFields(
                {
                    name: "Username",
                    value:
                        member.user.username +
                        (member.user.discriminator !== "0"
                            ? member.user.discriminator
                            : ""),
                    inline: true,
                },
                {
                    name: "User ID",
                    value: `\`${member.user.id}\``,
                    inline: true,
                },
                {
                    name: "Mention",
                    value: `<@${member.user.id}>`,
                },
                {
                    name: "Account creation date",
                    value: `<t:${member.user.createdTimestamp
                        .toString()
                        .slice(0, -3)}:f> (${convertTimestampToYearsMonthsDays(
                        member.user.createdTimestamp
                    )})`,
                }
            );

        /* TODO: 
            - mention the user who created the invite the member used to join 
            - show the invite link
        */

        function convertTimestampToYearsMonthsDays(timestamp: number) {
            const secondsInYear = 31536000; // Average seconds in a year
            const secondsInMonth = 2592000; // Average seconds in a month
            const secondsInDay = 86400; // Seconds in a day

            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - timestamp) / 1000); // Convert to seconds

            const years = Math.floor(elapsedSeconds / secondsInYear);
            const months = Math.floor(
                (elapsedSeconds % secondsInYear) / secondsInMonth
            );
            const days = Math.floor(
                ((elapsedSeconds % secondsInYear) % secondsInMonth) /
                    secondsInDay
            );

            // return {
            //     years,
            //     months,
            //     days,
            // };

            return `${years}y, ${months}m, ${days}d`;
        }

        const kick = new ButtonBuilder()
            .setLabel("Kick")
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`joinGateLogKick.${member.user.id}`);

        const ban = new ButtonBuilder()
            .setLabel("Ban")
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`joinGateLogBan.${member.user.id}`);

        const actionrow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            kick,
            ban
        );

        await channel.send({
            embeds: [embed],
            components: [actionrow],
        });
    },
};

// 6687627524
