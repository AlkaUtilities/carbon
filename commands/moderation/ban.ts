import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    GuildMember,
    GuildMemberRoleManager,
    EmbedBuilder,
} from "discord.js";

// TODO Give server owner the ability to add a custom list of users/roles that can access this command.
module.exports = {
    // disabled: true,
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a user from the server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User to ban")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason for banning the user")
        ),
    initialReply: true,
    global: true,
    async execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getUser("user", true);
        const targetMember = interaction.guild?.members.cache.get(target.id);
        const reason = interaction.options.getString("reason")
            ? interaction.options.getString("reason", true)
            : "No reason provided.";
        if (targetMember !== undefined) {
            // executes if the target is in the server
            const me = interaction.guild?.members.me as GuildMember;
            const targetRoles = targetMember?.roles;
            const memberRoles = interaction.member
                ?.roles as GuildMemberRoleManager;

            // this line checks if target's role is higher than member's role
            // and checks if both of them has no role, check if member id is equal to server owner id
            if (
                targetRoles.highest.position >= memberRoles.highest.position &&
                targetRoles.cache.size === 0 &&
                memberRoles.cache.size === 0 &&
                interaction.guild?.ownerId === interaction.user.id
            ) {
                return await interaction.followUp({
                    content:
                        "You can't take action on this user as your role isn't higher than theirs",
                    ephemeral: true,
                });
            } else if (
                targetRoles.highest.position >= me.roles.highest.position
            )
                return await interaction.followUp({
                    content:
                        "I can't take action on this user as my role isn't higher than theirs",
                    ephemeral: true,
                });
            else if (!targetMember?.bannable)
                return await interaction.followUp({
                    content:
                        "Unable to take action on this user as user isn't bannable.",
                    ephemeral: true,
                });

            await targetMember
                ?.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(
                                `You were banned from ${interaction.guild?.name}`
                            )
                            .setDescription(`Reason: ${reason}`)
                            .setColor("#d41c1c")
                            .setTimestamp()
                            .setThumbnail(
                                interaction.guild?.iconURL()
                                    ? interaction.guild?.iconURL()
                                    : null
                            )
                            .setFooter({
                                text: `Moderator: ${interaction.user.tag}`,
                                iconURL: interaction.user.displayAvatarURL(),
                            }),
                    ],
                })
                .catch((err) =>
                    interaction.followUp({
                        content:
                            "Unable to send ban message to user's direct message",
                    })
                );

            await targetMember
                ?.ban({ reason: reason, deleteMessageSeconds: 0 })
                .then(async () => {
                    const embed = new EmbedBuilder()
                        .setTitle(`${target.tag} was banned`)
                        .setDescription(`Reason: ${reason}`)
                        // .setDescription(`**${target.tag} was banned**\nReason: ${reason}`)
                        .setColor("#d41c1c")
                        .setTimestamp()
                        // .setThumbnail(target.displayAvatarURL())
                        .setFooter({
                            text: `Moderator: ${interaction.user.tag}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        });
                    await interaction.followUp({ embeds: [embed] });
                });

            return;
        } else {
            const guild = interaction.guild;
            const bans = await guild?.bans.fetch();
            if (bans?.find((m) => m.user.id === target.id))
                return interaction.followUp({
                    content: `**${target.tag}** is already banned.`,
                });
            await guild?.members
                .ban(target, {
                    reason: reason,
                    deleteMessageSeconds: 0,
                })
                .then(async () => {
                    const embed = new EmbedBuilder()
                        .setTitle(`${target.tag} was banned`)
                        .setDescription(`Reason: ${reason}`)
                        // .setDescription(`**${target.tag} was banned**\nReason: ${reason}`)
                        .setColor("#d41c1c")
                        .setTimestamp()
                        // .setThumbnail(target.displayAvatarURL())
                        .setFooter({
                            text: `Moderator: ${interaction.user.tag}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        });
                    await interaction.followUp({ embeds: [embed] });
                });
        }
    },
};
