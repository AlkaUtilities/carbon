import { GuildMember, EmbedBuilder, Client } from "discord.js";
import { schema } from "../../../schemas/guilds";
import { HydratedDocumentFromSchema } from "mongoose";
import { CheckResultNamed, CheckFlags } from "../../../typings/checks.d";

module.exports = {
    name: "checkResult",
    order: -2,
    flags: [
        CheckFlags.AlwaysRun,
        CheckFlags.NoReturn,
        CheckFlags.ImportCheckResults,
    ],
    async execute(
        member: GuildMember,
        client: Client,
        guildDocument: HydratedDocumentFromSchema<typeof schema>,
        args: any[]
    ) {
        // console.log(JSON.stringify(args, null, 2));
        if (!guildDocument)
            return {
                passed: null,
                code: -1,
                reason: "Guild document not found.",
            };

        const module = guildDocument.Settings?.Modules?.JoinGate?.CheckResult;

        if (!module)
            return {
                passed: null,
                code: -1,
                reason: "Module not found.",
            };

        if (!module.Enabled)
            return { passed: true, code: -1, reason: "Module disabled." };

        if (!module.ChannelID)
            return { passed: null, code: -1, reason: "Channel ID missing." };

        const channel = member.guild.channels.cache.get(module.ChannelID);

        if (!channel)
            return { passed: null, code: -1, reason: "Channel not found." };

        if (!channel.isTextBased())
            return {
                passed: null,
                code: -1,
                reason: "Channel is not a text channel.",
            };

        let checks = args[0] as CheckResultNamed[];

        // filters disabled checks
        checks = checks.filter((i) => i.code !== -1);

        // console.log(checks);

        const checksEmbed = new EmbedBuilder()
            .setTitle(
                member.user.username +
                    (member.user.discriminator !== "0"
                        ? "#" + member.user.discriminator
                        : "") +
                    " checks"
            )
            .setColor(member.user.hexAccentColor || client.config.colors.theme)
            .setDescription(
                checks
                    .map((t) => {
                        let passing = "";

                        if (t.passed === true) {
                            passing = client.icon.true;
                        } else if (t.passed === false) {
                            passing = client.icon.false;
                        } else {
                            passing = client.icon.unknown;
                        }

                        passing += ` ${t.passed} (${t.code})`;

                        return `**${t.friendlyName || t.name}** ${passing}`;
                    })
                    .join("\n")
            );

        /**
             * 
            .setDescription(
                [
                    `Account creation: <t:${member.user.createdTimestamp}:f>`,
                ].join("\n")
            )
            .setImage(
                member.user.displayAvatarURL({
                    size: 128,
                    extension: "webp",
                })
            )
             */

        channel.send({ embeds: [checksEmbed] });
    },
};
