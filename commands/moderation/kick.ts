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
                .setMaxLength(512)
        ),
    initialReply: true,
    global: true,
    async execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getUser("user");
        if (target === null)
            return await interaction.followUp({
                content:
                    "I can't take action on this user as this user is not in this server.",
                ephemeral: true,
            });
        const targetMember = interaction.guild?.members.cache.get(
            interaction.options.getUser("user", true)?.id
        ) as GuildMember;
        const me = interaction.guild?.members.me as GuildMember;
        const targetRoles = targetMember.roles as GuildMemberRoleManager;
        const memberRoles = interaction.member?.roles as GuildMemberRoleManager;

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
        } else if (targetRoles.highest.position >= me.roles.highest.position)
            return await interaction.followUp({
                content:
                    "I can't take action on this user as my role isn't higher than theirs",
                ephemeral: true,
            });
        else if (!targetMember.kickable)
            return await interaction.followUp({
                content:
                    "Unable to take action on this user as user isn't kickable.",
                ephemeral: true,
            });

        const reason = interaction.options.getString("reason")
            ? interaction.options.getString("reason", true)
            : "No reason provided.";

        try {
            const embed = new EmbedBuilder()
                .setTitle(`You were kicked from ${interaction.guild?.name}`)
                .setDescription(`Reason: ${reason}`)
                // .setDescription(`**${target.tag} was kicked**\nReason: ${reason}`)
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
                });
            await targetMember.send({ embeds: [embed] }).catch((err) =>
                interaction.followUp({
                    content:
                        "Unable to send ban message to user's direct message",
                })
            );
        } catch (err) {
            if (err)
                interaction.followUp({
                    content:
                        "Unable to send kick message to user's direct message",
                });
        }

        targetMember.kick(reason).then(async () => {
            const embed = new EmbedBuilder()
                .setTitle(`${targetMember.user.tag} was kicked`)
                .setDescription(`Reason: ${reason}`)
                // .setDescription(`**${target.tag} was kicked**\nReason: ${reason}`)
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
    },
};
