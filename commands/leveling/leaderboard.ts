import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
} from "discord.js";
import { Document, Types } from "mongoose";
import UserLeveling from "../../schemas/userLeveling";

module.exports = {
    name: "leaderboard",
    disabled: false, // is the command disabled?
    hasESub: false, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developer: false, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Get a list of users with the highest level")
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        return interaction.reply("work in progress...");
        await interaction.deferReply();
        if (!interaction.guildId) return;

        const LeaderboardData = (
            await UserLeveling.find({
                GuildID: interaction.guildId,
            })
        ).sort(function (a, b) {
            return b.Level * 100 + b.XP - (a.Level * 100 + a.XP);
        });

        function getTopX(
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
            x: number
        ) {
            let i = 1;
            let top: Array<string> = [];
            for (const Data of LeaderboardData) {
                if (i === x + 1) return;
                const member = interaction.guild?.members.cache.get(
                    Data.UserID
                );
                top
                    .push
                    // `#${i} <:space:1041709838184497283><:space:1041709838184497283><:space:1041709838184497283><:space:1041709838184497283><:space:1041709838184497283><:space:1041709838184497283><:space:1041709838184497283><:space:1041709838184497283><:space:1041709838184497283><:space:1041709838184497283>\r#${i} ${member?.user.tag}`
                    ();
                i++;
            }
        }

        // const embed = new EmbedBuilder()
        //     .setTitle("Top 10")
        //     .setDescription("WIP");
    },
};
