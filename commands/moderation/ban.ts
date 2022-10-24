import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, GuildMember, GuildMemberRoleManager } from 'discord.js'

// TODO Give server owner the ability to add a custom list of users/roles that can access this command.
module.exports = {
    // disabled: true,
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription("Bans a user from the server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addSubcommand((option) => option
            .setName('perm')
            .setDescription("Permanently bans a user from the server")   
            .addUserOption((option) => option
                .setName('user')
                .setDescription("User to ban")
                .setRequired(true)
            )
            .addStringOption((option) => option
                .setName('reason')
                .setDescription("Reason for banning the user")
            ) 
        )
        .addSubcommand((option) => option
        .setName('temp')
        .setDescription("Temporarily bans a user from the server")   
        .addUserOption((option) => option
            .setName('user')
            .setDescription("User to ban")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName('reason')
            .setDescription("Reason for banning the user")
        )
        .addStringOption((option) => option
            .setName('duration')
            .setDescription("Duration of the ban")
        )
    ),
    initialReply: true,
    async execute(interaction:ChatInputCommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            // TODO make this command works without having the target in the server.
            // TODO add the functionality to ban.temp
            case 'perm': {
                const target = interaction.options.getUser('user', true);
                const targetMember = (interaction.guild?.members.cache.get(interaction.options.getUser('user', true)?.id) as GuildMember);
                const reason = interaction.options.getString('reason') ? `\`${interaction.options.getString('reason')}\`` : "No reason provided."
                if (!targetMember === null) { 
                    // executes if the target is in the server
                    const me = (interaction.guild?.members.me as GuildMember)
                    const targetRoles = (targetMember.roles);
                    const memberRoles = (interaction.member?.roles as GuildMemberRoleManager);
            
                    // this line checks if target's role is higher than member's role
                    // and checks if both of them has no role, check if member id is equal to server owner id
                    if (targetRoles.highest.position >= memberRoles.highest.position && (targetRoles.cache.size === 0 && memberRoles.cache.size === 0 && interaction.guild?.ownerId === interaction.user.id)) {
                            return await interaction.followUp({ content: "You can't take action on this user as your role isn't higher than theirs", ephemeral: true });
                    }
                    else if (targetRoles.highest.position >= me.roles.highest.position)
                        return await interaction.followUp({ content: "I can't take action on this user as my role isn't higher than theirs", ephemeral: true });
                    else if (!targetMember.kickable)
                        return await interaction.followUp({ content: "Unable to take action on this user as user isn't kickable.", ephemeral: true })
            
                    try {
                        await targetMember.send({ content: `You have been banned from **${interaction.guild?.name}**\nReason: ${reason}` }).catch((err) => {console.log(err)})
                        .catch((err) => interaction.followUp({ content: "Unable to send ban message to user's direct message" }));
                    } catch (err) {
                        interaction.followUp({ content: "Unable to send ban message to user's direct message" })
                    }
                    await targetMember.ban({ reason: reason, deleteMessageSeconds: 0 });
            
                    await interaction.followUp({ content: `Banned ${targetMember.user.tag} from the server.\nReason: ${reason}` });
                    return;
                } else {
                    const guild = interaction.guild;
                    await guild?.members.ban(target, {
                        reason: reason,
                        deleteMessageSeconds: 0
                    })
                }
            };
            break;
        }
    }
};