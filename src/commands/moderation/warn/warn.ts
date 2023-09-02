import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    PermissionFlagsBits,
    GuildMember,
    GuildMemberRoleManager,
} from "discord.js";
module.exports = {
    name: "warn",
    disabled: false, // is the command disabled?
    hasESub: false, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developer: false, // is command developer only?
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
                // ephemeral: true,
            });

        const me = interaction.guild?.members.me as GuildMember;
        const targetRoles = targetMember.roles;
        const memberRoles = interaction.member?.roles as GuildMemberRoleManager;

        // this line checks if target's role is higher than member's role
        // and checks if both of them has no role, check if member id is equal to server owner id
        if (
            targetRoles.highest.position >= memberRoles.highest.position &&
            targetRoles.cache.size === 0 &&
            memberRoles.cache.size === 0 &&
            interaction.guild?.ownerId === interaction.user.id
        ) {
            return await interaction.editReply({
                content:
                    "You can't take action on this user as your role isn't higher than theirs",
                // ephemeral: true,
            });
        } else if (targetRoles.highest.position >= me.roles.highest.position)
            return await interaction.editReply({
                content:
                    "I can't take action on this user as my role isn't higher than theirs",
                // ephemeral: true,
            });
    },
};
