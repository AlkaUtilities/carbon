import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    PermissionFlagsBits,
    GuildMember,
    GuildMemberRoleManager,
    EmbedBuilder,
} from "discord.js";

import { Types } from "mongoose";

import MemberSchema from "../../schemas/members";

export const command = {
    name: "warn",
    disabled: false, // is the command disabled?
    hasExternalSubcommand: false, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developerOnly: false, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warns a user")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption((user) =>
            user
                .setName("user")
                .setDescription("User to warn")
                .setRequired(true)
        )
        .addStringOption((string) =>
            string
                .setName("reason")
                .setDescription("Reason for warning the user")
                .setRequired(true)
        ),
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

        const dmEmbed = new EmbedBuilder()
            .setTitle(`You have been warned in ${interaction.guild?.name}`)
            .setDescription(`Reason: ${reason}`)
            .setColor(client.config.colors.bad)
            .setTimestamp()
            .setThumbnail(
                interaction.guild?.iconURL()
                    ? interaction.guild?.iconURL()
                    : null
            );

        await targetMember.send({ embeds: [dmEmbed] }).catch((err) =>
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

        targetDocument.Records.Warnings.push(record);

        await targetDocument.save();

        const embed = new EmbedBuilder()
            .setTitle(
                `Warned ${
                    target.username +
                    (target.discriminator !== "0"
                        ? ` #${target.discriminator}`
                        : "")
                }`
            )
            .setFields(
                {
                    name: "Target",
                    value: `<@${target.id}>`,
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
                    value: `<t:${time.getTime().toString().slice(0, -3)}:R>`,
                    inline: false,
                }
            )
            .setColor(client.config.colors.succesful)
            .setTimestamp()
            .setThumbnail(
                target.displayAvatarURL({
                    extension: "webp",
                    size: 128,
                })
            );

        await interaction.editReply({
            embeds: [embed],
        });
    },
};
