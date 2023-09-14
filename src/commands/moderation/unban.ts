import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    GuildMember,
    GuildMemberRoleManager,
    EmbedBuilder,
} from "discord.js";

export const command = {
    // disabled: true,
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unbans a user from the server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription(
                    "ID of the user to unban (ex: 529424782438170679)"
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason for unbanning the user")
                .setMaxLength(512)
        )
        .setDMPermission(false),
    // initialReply: true,
    global: true,
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        // no need to check if the user id passed in was a valid id
        // thanks to discord
        const target = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason")
            ? interaction.options.getString("reason", true)
            : "No reason provided.";
        const guild = interaction.guild;
        /* {
            name: 'user',
            type: 6,
            value: '590433396073824257',
            user: User {
                id: '590433396073824257',
                bot: false,
                system: false,
                flags: UserFlagsBitField { bitfield: 0 },
                username: 'Clydе',
                discriminator: '5778',
                avatar: 'a754dc870051fa5dab723ff7f6fe0bbf',
                banner: undefined,
                accentColor: undefined
            }
        } */
        const bans = await guild?.bans.fetch();
        const targetBan = bans?.find((ban) => ban.user.id === target.id);

        if (!targetBan)
            return interaction.editReply({
                content: "This user is not banned from the guild.",
            });

        // what works: user id (string), User object, or GuildMember object
        const unban = await guild?.members
            .unban(targetBan.user, reason)
            .then(async () => {
                const embed = new EmbedBuilder()
                    .setTitle(`${target.tag} was unbanned`)
                    .setDescription(`Reason: ${reason}`)
                    // .setDescription(`**${target.tag} was unbanned**\nReason: ${reason}`)
                    .setColor("#1cd450")
                    .setTimestamp()
                    // .setThumbnail(target.displayAvatarURL())
                    .setFooter({
                        text: `Moderator: ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL(),
                    });
                await interaction.editReply({ embeds: [embed] });
            })
            .catch((err) => {
                interaction.editReply({
                    content: `Unable to unban ${target.tag} from the server.\nPlease check the console.`,
                });
                console.log(err);
            });
    },
};
