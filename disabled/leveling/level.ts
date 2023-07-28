import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
} from "discord.js";
import UserLeveling from "../../schemas/userLeveling";
import GuildLevelingSetting from "../../schemas/guildLevelingSetting";

module.exports = {
    name: "level",
    disabled: false, // is the command disabled?
    hasESub: false, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developer: false, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("level")
        .setDescription("Manage member's level")
        .setDMPermission(false)
        .addSubcommand((option) =>
            option
                .setName("set")
                .setDescription("Set member's level to a given value")
                .addUserOption((user) =>
                    user
                        .setName("member")
                        .setDescription("Member to set level to")
                        .setRequired(true)
                )
                .addNumberOption((number) =>
                    number
                        .setName("level")
                        .setDescription("Level to set to member")
                        .setRequired(true)
                )
        ),
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        const { options, guild, guildId } = interaction;
        await interaction.deferReply();

        const GuildLevelingSettingData = await GuildLevelingSetting.findOne({
            GuildID: guildId,
        });

        if (!GuildLevelingSettingData || !GuildLevelingSettingData.Enabled) {
            return interaction.editReply({
                content: `**Error**: Leveling is not enabled in this server. Enable it by using \`/leveling toggle\``,
            });
        }

        switch (options.getSubcommand()) {
            case "set": {
                const user = options.getUser("member", true);
                if (user.bot)
                    return interaction.editReply({
                        content: "Specified member is a bot",
                    });
                const member = guild?.members.cache.get(user.id);
                const level = options.getNumber("level", true);

                if (!member)
                    return interaction.editReply({
                        content: `Error: Specified user is not in server\nSpecified user: ${user.id}`,
                    });

                if (level < 1)
                    return interaction.editReply({
                        content: `Error: Level cannot be less than 1\nSpecified level: \`${level}\``,
                    });

                let UserLevelingData = await UserLeveling.findOne({
                    UserID: user.id,
                    GuildID: guildId,
                });

                if (!UserLevelingData) {
                    // returns target has not sent any message if not available
                    // return interaction.editReply({
                    //     content: `${member.user.username} has not sent any message`,
                    // });

                    // creates a new document for target if not available
                    UserLevelingData = await UserLeveling.create({
                        UserID: user.id,
                        GuildID: guildId,
                        Level: level,
                    });
                }

                // when setting a user's level down, xp might be higher than the set level's goal
                // therefore causing the user to have more xp than the goal

                UserLevelingData.updateOne({
                    $set: {
                        Level: level,
                    },
                })
                    .then(() => {
                        return interaction.editReply({
                            content: `Set **${member.user.username}**'s level to **${level}**`,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        return interaction.editReply({
                            content: `There was an error trying to update **${member.user.username}**'s level`,
                        });
                    });
            }
        }
    },
};
