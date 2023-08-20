import { GuildMember, EmbedBuilder, Client } from "discord.js";
import { schema } from "../../../../schemas/guilds";
import { HydratedDocumentFromSchema } from "mongoose";
import { CheckResult } from "../../../../typings/checks";

module.exports = {
    ignore: true, // prevent event handler
    name: "memberAccountAge",
    order: 0,
    breakOnFail: false,
    async execute(
        member: GuildMember,
        client: Client,
        guildDocument: HydratedDocumentFromSchema<typeof schema>
    ): Promise<CheckResult> {
        if (!guildDocument)
            return { passed: null, reason: "Guild document not found." };

        const module = guildDocument.Settings?.Modules?.JoinGate?.AccountAge;

        if (!module)
            return {
                passed: null,
                reason: "Module not found.",
            };

        if (!module.Enabled)
            return { passed: true, reason: "Module disabled." };

        const timeSinceCreated = Date.now() - member.user.createdTimestamp;

        // console.log(timeSinceCreated);

        const minimumAccountAge =
            1000 * 60 * 60 * 24 * module.MinimumAccountAge;

        if (timeSinceCreated >= minimumAccountAge)
            return {
                passed: true,
                reason: "Account is equal to or older than minimum age.",
            };

        let resultBreak = false;

        switch (module.Action) {
            case "kick":
                {
                    resultBreak = true;
                    const embed = new EmbedBuilder()
                        .setTitle(
                            `You have been kicked from ${member.guild.name}`
                        )
                        .setDescription(
                            `Your account must be older than **${module.MinimumAccountAge} days** to join this server.`
                        );

                    await member
                        .send({
                            embeds: [embed],
                        })
                        .catch(() => undefined);

                    await member.kick(
                        `Your account must be older than ${module.MinimumAccountAge} days to join this server.`
                    );
                }
                break;

            case "ban":
                {
                    resultBreak = true;
                    const embed = new EmbedBuilder()
                        .setTitle(
                            `You have been banned from ${member.guild.name}`
                        )
                        .setDescription(
                            `Your account must be older than **${module.MinimumAccountAge} days** to join this server.`
                        );

                    await member
                        .send({
                            embeds: [embed],
                        })
                        .catch(() => undefined);

                    await member.ban({
                        reason: `Your account must be older than ${module.MinimumAccountAge} days to join this server.`,
                        deleteMessageSeconds: 0,
                    });
                }
                break;
        }

        // if action has something to do with removing the user, break the test loop
        // else, dont break the test. this is necessary because if the user is removed
        // the tests after this might need to access the user and wouldn't be able to

        return {
            passed: false,
            reason: "Account is younger than minimum age.",
            break: resultBreak, // example of a dynamic break
        };
    },
};
