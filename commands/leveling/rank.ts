import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    // EmbedBuilder,
    AttachmentBuilder,
} from "discord.js";
import { Document, Types } from "mongoose";
// import ProgressBar from "string-progressbar";
import UserLeveling from "../../schemas/userLeveling";
import GuildLevelingSetting from "../../schemas/guildLevelingSetting";
import { Canvas, loadImage } from "canvas-constructor/napi-rs";
// import { request } from "undici";
import axios from "axios";

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

        /* using canvas */
        let canvas = new Canvas(800, 200);
        let ctx = canvas.context;
        let settings = {
            name_x: 220,
            name_y: 125,
            // rank_x: 520,
            // rank_y: 60,
            // level_x: 520 + 130,
            // level_y: 60,
            rank_level_X: 670,
            rank_level_y: 50,
            xp_counter_x: 740,
            xp_counter_y: 125,
            xp_bar_x: 220, // original: 260
            xp_bar_y: 150,
            xp_bar_width: 500,
            avatar_x: 40,
            avatar_y: 25,
        };

        /* background */
        ctx.fillStyle = "#1b1f22";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#141617";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        /* username & discrim */
        // draw username
        ctx.font = "bold 28px MANROPE_BOLD";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "start";
        ctx.fillText(target.username, settings.name_x, settings.name_y);

        // draw discriminator
        ctx.font = "bold 20px MANROPE_BOLD";
        ctx.fillStyle = "#858383";
        ctx.textAlign = "start";
        ctx.fillText(
            "#" + target.discriminator,
            // ctx.measureText(data.username).width + 255,
            ctx.measureText(target.username).width +
                settings.name_x +
                ctx.measureText(target.username).width * (44 / 100),
            settings.name_y
        );

        /* rank and level */
        // rank and level label
        // ctx.font = "light 24px MANROPE_LIGHT";
        // ctx.fillStyle = "#ffffff";
        // ctx.textAlign = "start";
        // ctx.fillText("RANK", settings.rank_x, settings.rank_y);
        // ctx.fillStyle = data.main_color || "#4cbd49";
        // ctx.fillText("LEVEL", settings.level_x, settings.level_y);

        // rank and level value
        // ctx.font = "light 42px MANROPE_LIGHT";
        // ctx.fillStyle = "#ffffff";
        // ctx.textAlign = "start";
        // ctx.fillText("#" + data.rank, settings.rank_x + 75, settings.rank_y);
        // ctx.fillStyle = data.main_color || "#4cbd49";
        // ctx.fillText(data.level, settings.level_x + 75, settings.level_y);

        ctx.font = "light 24px MANROPE_LIGHT";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "end";
        ctx.fillText(
            `RANK #${rank} LEVEL ${UserLevelingData.Level}`,
            settings.rank_level_X + 75,
            settings.rank_level_y
        );

        /* xp value */
        ctx.font = "light 20px MANROPE_LIGHT";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "end";
        ctx.fillText(
            `${UserLevelingData.XP} / ${levelGoal} XP`,
            settings.xp_counter_x,
            settings.xp_counter_y
        );

        /* xp bar */
        ctx.lineJoin = "round";
        ctx.lineWidth = 30;

        // empty bar
        ctx.strokeStyle = "#3b3e40";
        ctx.strokeRect(
            settings.xp_bar_x + 10,
            settings.xp_bar_y,
            settings.xp_bar_width,
            0
        );

        // filled bar
        ctx.strokeStyle = "#4cbd49"; // data.main_color || "#4cbd49";
        ctx.strokeRect(
            settings.xp_bar_x + 10,
            settings.xp_bar_y,
            settings.xp_bar_width * (UserLevelingData.XP / levelGoal),
            0
        );

        /* avatar */
        // circle
        ctx.beginPath();
        // ctx.arc(115, 125, 75, 0, Math.PI * 2, true);
        ctx.arc(
            settings.avatar_x + 75,
            settings.avatar_y + 75,
            75,
            0,
            Math.PI * 2,
            true
        );
        ctx.closePath();
        ctx.clip();

        // draw avatar
        // const avatar = await request(
        //     target.displayAvatarURL({ extension: "jpg" })
        // );

        const avatar = await axios.request({
            url: target.displayAvatarURL({ extension: "jpg" }),
        }); // request(
        //     target.displayAvatarURL({ extension: "jpg" })
        // );
        ctx.drawImage(
            // await loadImage(await avatar.body.arrayBuffer()),
            await loadImage(await avatar.data),
            settings.avatar_x,
            settings.avatar_y,
            150,
            150
        );

        const attachment = new AttachmentBuilder(await canvas.png(), {
            name: "test.png",
        });

        interaction.editReply({ files: [attachment] });

        /* using embed */
        // const progressBar = ProgressBar.filledBar(
        //     UserLevelingData.Level * client.config.userLeveling.required,
        //     UserLevelingData.XP,
        //     18,
        //     "<:progress_empty:1041845992829497415>", // empty progress
        //     "<:progress_fill:1041845994834366464>" // fill progress
        // )[0];

        // const embed = new EmbedBuilder()
        //     .setAuthor({
        //         iconURL: target.displayAvatarURL(),
        //         name: `${target.tag}'s rank`,
        //     })
        //     .setTitle(
        //         rank !== -1
        //             ? `Rank **#${rank}**`
        //             : `<:error:1010522832108785664> Unable to find matching user/guild id in database`
        //     )
        //     .setDescription(
        //         // `**Rank** : ${
        //         //     rank !== -1
        //         //         ? `**#${rank}**`
        //         //         : `<:error:1010522832108785664> Unable to find matching user/guild id in database`
        //         // }\n` +
        //         `**Level** : ${UserLevelingData.Level}\n` +
        //             `**XP** : ${UserLevelingData.XP}/${levelGoal} (${(
        //                 (UserLevelingData.XP / levelGoal) *
        //                 100
        //             ).toFixed(1)}%)\n` +
        //             `**Score** : ${
        //                 (UserLevelingData.Level - 1) * LevelGoalMultiplier +
        //                 UserLevelingData.XP
        //             }\n` +
        //             `**Server XP Rate** : ${GuildLevelingSettingData?.XPMultiplier}x\n` +
        //             // `**Server XP Increment Interval** : ${GuildLevelingSettingData?.XPIncrementInterval} seconds\n` +
        //             `**Server XP Increment Interval** : ${
        //                 GuildLevelingSettingData?.XPIncrementInterval === 0
        //                     ? "Disabled"
        //                     : GuildLevelingSettingData?.XPIncrementInterval > 1
        //                     ? `${GuildLevelingSettingData?.XPIncrementInterval} seconds`
        //                     : `${GuildLevelingSettingData?.XPIncrementInterval} second`
        //             }\n` +
        //             `\n${progressBar}\n`
        //         // `You can get ${client.config.userLeveling.min} to ${client.config.userLeveling.max} XP **every ${GuildSettingsData?.LevelingXPIncrementInterval} seconds**. This setting can be changed using the settings command\n`
        //     )
        //     // .setTimestamp()
        //     .setColor("#4cbd49");

        // we dont need a footer to identify the interaction user, its using defer and not initial reply
        // if (!ephemeral)
        //     embed.setFooter({
        //         text: interaction.user.tag,
        //         iconURL: interaction.user.displayAvatarURL(),
        //     });

        // interaction.editReply({ embeds: [embed] });
    },
};
