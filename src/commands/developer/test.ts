import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
module.exports = {
    name: "test",
    disabled: false, // is the command disabled?
    hasExternalSubcommand: false, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developer: true, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("test")
        .addUserOption((option) =>
            option.setName("user").setDescription("user").setRequired(true)
        )
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        if (!interaction.guild)
            return interaction.reply({ content: "Guild not found" });

        const user = interaction.options.getUser("user", true);
        const member = interaction.guild.members.cache.get(user.id);
        const botHighestRolePosition =
            interaction.guild.members.me?.roles.highest.position || 0;

        if (!member) return interaction.reply({ content: "Member not found" });

        const staffRoles = member.roles.cache.filter(
            (r) =>
                r.permissions.has("ManageChannels", true) && // check for Manage Channels permission
                r.position < botHighestRolePosition && // check for role position (less than bot's highest role)
                !(member.user.bot && r.name === member.user.username) // check for auto assigned role (for bots)
        );

        await interaction.reply(
            `Removing (${staffRoles.size}): ${staffRoles
                .map((r) => `<@&${r.id}>`)
                .join(", ")}`
        );

        // FIXME: If user is bot, role automatically assigned to bot *cannot be removed*
        // FIXME: If user's role cannot be removed if its higher than bot's
        member.roles.remove(staffRoles).then(async () => {
            await interaction.followUp({
                content: `${staffRoles.size} roles removed.`,
            });
        });
        // .catch(() => {
        //     interaction.reply({ content: `Unable to remove roles.` });
        // });
    },
};
