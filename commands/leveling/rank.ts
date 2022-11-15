import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
} from "discord.js";
import { Document, Types } from "mongoose";
import ProgressBar from "string-progressbar";
import UserLeveling from "../../schemas/userLeveling";
import GuildLevelingSetting from "../../schemas/guildLevelingSetting";

function getRankPosition(
    LeaderboardData: (Document<
        unknown,
        any,
        {
            UserID: string;
            GuildID: string;
            Level: number;
            XP: number;
        }
    > & {
        UserID: string;
        GuildID: string;
        Level: number;
        XP: number;
    } & {
        _id: Types.ObjectId;
    })[],
    UserLevelingData: Document<
        unknown,
        any,
        {
            UserID: string;
            GuildID: string;
            Level: number;
            XP: number;
        }
    > & {
        UserID: string;
        GuildID: string;
        Level: number;
        XP: number;
    } & {
        _id: Types.ObjectId;
    }
) {
    let i = 1;
    for (const Data of LeaderboardData) {
        if (
            UserLevelingData.GuildID === Data.GuildID &&
            UserLevelingData.UserID === Data.UserID
        ) {
            return i;
        } else {
            i++;
        }
    }
    return -1;
}

module.exports = {
    name: "rank",
    // initialReply: false, // does command execute with an initial reply?
    developer: false, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Get your rank or another member's rank")
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The user to be checked")
                .setRequired(false)
        )
        .addBooleanOption((option) =>
            option
                .setName("ephemeral")
                .setDescription(
                    "Reply as a message that only you can see or everyone can see (Default: true)"
                )
        )
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        const ephemeral =
            interaction.options.getBoolean("ephemeral") === null
                ? true
                : interaction.options.getBoolean("ephemeral", true);
        await interaction.deferReply({ ephemeral: ephemeral });
        let target = interaction.options.getUser("member");
        if (!target || !interaction.guild?.members.cache.has(target.id)) {
            target = interaction.user;
        }
        if (target.bot)
            return interaction.editReply({
                content: "Specified member is a bot",
            });
        if (!interaction.guildId) return;

        const LevelGoalMultiplier = client.config.userLeveling.required;

        // check author level and xp
        const UserLevelingData = await UserLeveling.findOne({
            UserID: target.id,
        });

        let LeaderboardData = (
            await UserLeveling.find({
                GuildID: interaction.guildId,
            })
        ).sort(function (a, b) {
            return b.Level * 100 + b.XP - (a.Level * 100 + a.XP);
        });

        const GuildLevelingSettingData = await GuildLevelingSetting.findOne({
            GuildID: interaction.guildId,
        });

        if (!GuildLevelingSettingData || !GuildLevelingSettingData.Enabled) {
            return interaction.editReply({
                content: `**Error**: Leveling is not enabled in this server. Enable it by using \`/leveling toggle\``,
            });
        }

        if (!UserLevelingData)
            return interaction.editReply({
                content: `${target.username} has not sent any message`,
            });

        const rank = getRankPosition(LeaderboardData, UserLevelingData);
        const levelGoal = UserLevelingData.Level * LevelGoalMultiplier;
        const progressBar = ProgressBar.filledBar(
            UserLevelingData.Level * client.config.userLeveling.required,
            UserLevelingData.XP,
            18,
            "<:progress_empty:1041845992829497415>", // empty progress
            "<:progress_fill:1041845994834366464>" // fill progress
        )[0];

        const embed = new EmbedBuilder()
            .setAuthor({
                iconURL: target.displayAvatarURL(),
                name: `${target.tag}'s rank`,
            })
            .setTitle(
                rank !== -1
                    ? `Rank **#${rank}**`
                    : `<:error:1010522832108785664> Unable to find matching user/guild id in database`
            )
            .setDescription(
                // `**Rank** : ${
                //     rank !== -1
                //         ? `**#${rank}**`
                //         : `<:error:1010522832108785664> Unable to find matching user/guild id in database`
                // }\n` +
                `**Level** : ${UserLevelingData.Level}\n` +
                    `**XP** : ${UserLevelingData.XP}/${levelGoal} (${(
                        (UserLevelingData.XP / levelGoal) *
                        100
                    ).toFixed(1)}%)\n` +
                    `**Score** : ${
                        (UserLevelingData.Level - 1) * LevelGoalMultiplier +
                        UserLevelingData.XP
                    }\n` +
                    `**Server XP Rate** : ${GuildLevelingSettingData?.XPMultiplier}x\n` +
                    // `**Server XP Increment Interval** : ${GuildLevelingSettingData?.XPIncrementInterval} seconds\n` +
                    `**Server XP Increment Interval** : ${
                        GuildLevelingSettingData?.XPIncrementInterval === 0
                            ? "Disabled"
                            : GuildLevelingSettingData?.XPIncrementInterval > 1
                            ? `${GuildLevelingSettingData?.XPIncrementInterval} seconds`
                            : `${GuildLevelingSettingData?.XPIncrementInterval} second`
                    }\n` +
                    `\n${progressBar}\n`
                // `You can get ${client.config.userLeveling.min} to ${client.config.userLeveling.max} XP **every ${GuildSettingsData?.LevelingXPIncrementInterval} seconds**. This setting can be changed using the settings command\n`
            )
            // .setTimestamp()
            .setColor("#4cbd49");

        // we dont need a footer to identify the interaction user, its using defer and not initial reply
        // if (!ephemeral)
        //     embed.setFooter({
        //         text: interaction.user.tag,
        //         iconURL: interaction.user.displayAvatarURL(),
        //     });

        interaction.editReply({ embeds: [embed] });
    },
};
