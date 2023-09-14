import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    PermissionFlagsBits,
} from "discord.js";
export const command = {
    name: "modcheck",
    disabled: false, // is the command disabled?
    hasExternalSubcommand: false, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developerOnly: false, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("modcheck")
        .setDescription(
            "Check if a member is bannable, kickable, moderatable, and managable"
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("Member to check")
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("ephemeral")
                .setDescription(
                    "Reply as a message that only you can see or everyone can see (Default: true)"
                )
        ),
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        const ephemeral = interaction.options.getBoolean("ephemeral") ?? true;
        await interaction.deferReply({ ephemeral: ephemeral });
        const user = interaction.options.getUser("member", true);
        const member = interaction.guild?.members.cache.get(user.id);

        if (!member)
            return interaction.editReply({
                content:
                    "I can't take action on this user as this user is not in this server.",
            });

        const embed = new EmbedBuilder()
            .setTitle(`Checking ${user.username}#${user.discriminator}`)
            .setColor("#2f3136")
            .setDescription(
                [
                    `**Managable**: ${
                        member.manageable
                            ? `${client.icon.true} True`
                            : `${client.icon.false} False`
                    }`,
                    `**Moderatable**: ${
                        member.moderatable
                            ? `${client.icon.true} True`
                            : `${client.icon.false} False`
                    }`,
                    `**Kickable**: ${
                        member.kickable
                            ? `${client.icon.true} True`
                            : `${client.icon.false} False`
                    }`,
                    `**Bannable**: ${
                        member.bannable
                            ? `${client.icon.true} True`
                            : `${client.icon.false} False`
                    }\n`,
                ].join("\n")
            );

        interaction.editReply({ embeds: [embed] });
    },
};
