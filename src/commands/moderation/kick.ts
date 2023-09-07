import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    GuildMember,
    GuildMemberRoleManager,
    EmbedBuilder,
    Client,
} from "discord.js";

import { Types } from "mongoose";

import MemberSchema from "../../schemas/members";

module.exports = {
    // disabled: true,
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user from the server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User to kick")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason for kicking the user")
                .setRequired(true)
                .setMaxLength(512)
        ),
    // initialReply: true,
    global: true,
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        await interaction.deferReply();
        const target = interaction.options.getUser("user", true);
        const targetMember = interaction.guild?.members.cache.get(target.id);

        if (!targetMember)
            return await interaction.editReply({
                content:
                    "I can't take action on this user as this user is not in this server.",
            });

        const me = interaction.guild?.members.me as GuildMember;
        const targetRoles = targetMember.roles;
        const issuerRoles = interaction.member?.roles as GuildMemberRoleManager;

        // this line checks if target's role is higher than member's role
        if (
            targetRoles.cache.size !== 0 &&
            issuerRoles.cache.size !== 0 &&
            targetRoles.highest.position >= issuerRoles.highest.position
        )
            return await interaction.editReply({
                content:
                    "You can't take action on this user as your role isn't higher than theirs",
            });

        // this line checks if target's role is higher than bot's role
        // not really needed since this can be covered by `!targetMember.kickable`
        if (targetRoles.highest.position >= me.roles.highest.position)
            return await interaction.editReply({
                content:
                    "I can't take action on this user as my role isn't higher than theirs",
            });

        // this line checks if the member is kickable
        if (!targetMember.kickable)
            return await interaction.editReply({
                content:
                    "Unable to take action on this user as user isn't kickable.",
            });

        const reason = interaction.options.getString("reason")
            ? interaction.options.getString("reason", true)
            : "No reason provided.";

        let targetDocument = await MemberSchema.findOne({
            UserID: target.id,
            GuildID: interaction.guildId,
        });

        if (!targetDocument) {
            targetDocument = new MemberSchema({
                UserID: target.id,
                GuildID: interaction.guildId,
                Records: {
                    Warnings: [],
                    Kicks: [],
                    Bans: [],
                },
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(`You were kicked from ${interaction.guild?.name}`)
            .setDescription(`Reason: ${reason}`)
            .setColor(client.config.colors.bad)
            .setTimestamp()
            .setThumbnail(
                interaction.guild?.iconURL()
                    ? interaction.guild?.iconURL()
                    : null
            );

        await targetMember.send({ embeds: [embed] }).catch((err) =>
            interaction.followUp({
                // followup instead of edit??
                content: "Unable to send ban message to user's direct message",
            })
        );

        const time = new Date();

        const record = {
            _id: new Types.ObjectId(),
            IssuerID: interaction.user.id,
            Reason: reason,
            Time: time,
        };

        targetDocument.Records.Kicks.push(record);

        await targetDocument.save();

        await targetMember.kick(reason).then(async (member) => {
            const embed = new EmbedBuilder()
                .setTitle(
                    `Kicked ${
                        member.user.username +
                        (member.user.discriminator !== "0"
                            ? ` #${member.user.discriminator}`
                            : "")
                    }`
                )
                .setFields(
                    {
                        name: "Target",
                        value: `<@${member.user.id}>`,
                        inline: true,
                    },
                    { name: "\u200b", value: "\u200b", inline: true },
                    {
                        name: "Issuer",
                        value: `<@${interaction.user.id}>`,
                        inline: true,
                    },
                    { name: "Reason", value: reason, inline: true },
                    { name: "\u200b", value: "\u200b", inline: true },
                    {
                        name: "Record ID",
                        value: `\`${record._id.toString()}\``,
                        inline: true,
                    },
                    {
                        name: "Time",
                        value: `<t:${time
                            .getTime()
                            .toString()
                            .slice(0, -3)}:R>`,
                        inline: false,
                    }
                )
                .setColor(client.config.colors.succesful)
                .setTimestamp()
                .setThumbnail(
                    target.displayAvatarURL({ extension: "webp", size: 128 })
                );
            await interaction.editReply({ embeds: [embed] });
        });

        return;
    },
};
