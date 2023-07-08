import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    PermissionFlagsBits,
    GuildMember,
    GuildMemberRoleManager,
    EmbedBuilder,
} from "discord.js";
import ms from "ms";

module.exports = {
    name: "timeout",
    disabled: false, // is the command disabled?
    hasESub: false, // does the command has an external sub command?
    // initialReply: true, // does command execute with an initial reply?
    developer: false, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Restricts a member's ability to communicate.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User to timeout")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("duration")
                .setDescription("Duration of the timeout (5s, 1m, 30m, etc.)")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason for timeout-ing the user")
                .setMaxLength(512)
        ),
    global: true,
    execute(interaction: ChatInputCommandInteraction, client: Client) {
        const { options, member } = interaction;
        const target = options.getMember("user") as GuildMember;
        const duration = options.getString("duration", true);
        const reason = options.getString("reason")
            ? options.getString("reason", true)
            : "No reason provided.";

        if (!target)
            return interaction.reply({
                content: `Unable to find the member. Make sure the member is in the guild.`,
                ephemeral: true,
            });
        if (
            !ms(duration) ||
            ms(duration) < ms("1s") ||
            ms(duration) > ms("28d")
        )
            return interaction.reply({
                content: `Duration provided is invalid, less than 1 second, or over the 28 days limit.\nProvided duration: \`${duration}\``,
                ephemeral: true,
            });
        if (!target.manageable || !target.moderatable)
            return interaction.reply({
                content:
                    "Unable to take action on this user as this user isn't moderatable.",
            });
        if (
            (member?.roles as GuildMemberRoleManager).highest.position <
            target.roles.highest.position
        )
            return interaction.reply({
                content:
                    "You can't take action on this user as your role isn't higher than theirs",
                ephemeral: true,
            });

        target
            .timeout(ms(duration), reason ? reason : undefined)
            .then(async () => {
                const embed = new EmbedBuilder()
                    .setTitle(`${target.user.tag} was timed out`)
                    .setDescription(
                        `Duration: ${ms(ms(duration), {
                            long: true,
                        })}\nReason: ${reason}`
                    )
                    .setColor("#d41c1c")
                    .setTimestamp()
                    // .setThumbnail(target.displayAvatarURL())
                    .setFooter({
                        text: `Moderator: ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL(),
                    });
                await interaction.reply({ embeds: [embed] });
            })
            .catch((err) => console.log(err));
    },
};
