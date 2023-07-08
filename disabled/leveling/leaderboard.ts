import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
} from "discord.js";
import { Document, Types } from "mongoose";
import UserLeveling from "../../schemas/userLeveling";

function getTopX(
    interaction: ChatInputCommandInteraction,
    SortedLeaderboardData: (Document<
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
    x: number
) {
    let top: Array<{
        rank: number;
        level: number;
        xp: number;
        username: string;
        discriminator: string;
        tag: string;
    }> = [];
    for (let i = 0; i < x; i++) {
        const Data = SortedLeaderboardData.shift();
        if (!Data) continue;
        const member = interaction.guild?.members.cache.get(Data.UserID);
        if (!member) continue;
        top.push({
            rank: i + 1,
            level: Data.Level,
            xp: Data.XP,
            username: member.user.username,
            discriminator: member.user.discriminator,
            tag: member.user.tag,
        });
    }
    return top;
}

module.exports = {
    name: "leaderboard",
    disabled: false, // is the command disabled?
    hasESub: false, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developer: false, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Get a list of users with the highest level")
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName("view")
                .setDescription("Set leaderboards view (Default: score)")
                .setChoices(
                    { name: "score", value: "score" },
                    { name: "level_xp", value: "level_xp" }
                )
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
        if (!interaction.guildId) return;

        const levelingVariable = client.config.userLeveling;
        const view = interaction.options.getString("view", false) || "score";

        const LeaderboardData = (
            await UserLeveling.find({
                GuildID: interaction.guildId,
            })
        ).sort(function (a, b) {
            return (
                (b.Level - 1) * levelingVariable.required +
                b.XP -
                ((a.Level - 1) * levelingVariable.required + a.XP)
            );
        });

        let top = getTopX(interaction, LeaderboardData, 25);
        let topMapped: string[] = [];

        if (view === "score") {
            topMapped = top.map(
                (data) =>
                    `**#${data.rank}** **${data.tag}** Score: ${
                        (data.level - 1) * levelingVariable.required + data.xp
                    }`
            );
        } else {
            topMapped = top.map(
                (data) =>
                    `**#${data.rank}** **${data.tag}** Level: ${data.level} XP: ${data.xp}`
            );
        }

        // console.log(top25);
        const embed = new EmbedBuilder()
            .setTitle(
                `Top ${
                    topMapped.length > 1
                        ? `${topMapped.length} Players`
                        : `${topMapped.length} Player`
                } in ${interaction.guild?.name}`
            )
            .setDescription(topMapped.join("\n"))
            .setColor("#4cbd49");

        interaction.editReply({ embeds: [embed] });
    },
};
