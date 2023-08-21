import {
    GuildMember,
    EmbedBuilder,
    Client,
    AttachmentBuilder,
} from "discord.js";
import { CaptchaGenerator } from "captcha-canvas";
import { schema } from "../../../schemas/guilds";
import { HydratedDocumentFromSchema } from "mongoose";
import { CheckResult } from "../../../typings/checks";

module.exports = {
    name: "captcha",
    order: 1,
    breakOnFail: true,
    async execute(
        member: GuildMember,
        client: Client,
        guildDocument: HydratedDocumentFromSchema<typeof schema>
    ): Promise<CheckResult> {
        if (!guildDocument)
            return { passed: null, reason: "Guild document not found." };

        const verificationResult: {
            passed: boolean | null;
            reason: string | undefined;
        } = await new Promise(async (resolve, _) => {
            const module = guildDocument.Settings?.Modules?.JoinGate?.Captcha;

            if (!module)
                return resolve({
                    passed: null,
                    reason: "Module not found.",
                });

            if (!module.Enabled)
                return resolve({
                    passed: true,
                    reason: "Module disabled.",
                });

            if (!member.kickable)
                return resolve({
                    passed: true,
                    reason: "Member is not kickable.",
                });

            if (member.user.bot)
                return resolve({ passed: true, reason: "User is a bot." });

            const captcha = new CaptchaGenerator()
                .setDimension(150, 450)
                .setCaptcha({
                    size: 60,
                    color: client.config.colors.theme as string,
                })
                .setDecoy({
                    opacity: 1,
                })
                .setTrace({
                    color: client.config.colors.theme as string,
                });

            const attachment = new AttachmentBuilder(captcha.generateSync(), {
                name: "captcha.png",
                description: "Captcha",
            });

            const embed = new EmbedBuilder()
                .setTitle("Verify that you are not a robot")
                .setColor(client.config.colors.theme)
                .setDescription(
                    `Please type the captcha below to be able to access **${member.guild.name}**.`
                )
                .setFooter({ text: `Verification period: 2 minutes` })
                .setImage(`attachment://captcha.png`);

            await member
                .send({
                    embeds: [embed],
                    files: [attachment],
                })
                .catch(() => {
                    member.kick("User's direct message is disabled.");
                    return resolve({
                        passed: false,
                        reason: "User's direct message is disabled.",
                    });
                });

            const collector = member.dmChannel?.createMessageCollector({
                filter: (message) => message.author.id === member.id,
                time: 120000,
                max: 3,
            });

            const maxAttempts = module.MaxAttempts;
            let currentAttempts = 0;

            const roleID = guildDocument.Settings?.MainRoleID;
            const role = roleID
                ? member.guild.roles.cache.get(roleID)
                : undefined;

            collector?.on("collect", async (message) => {
                currentAttempts++;

                // If message content is equal to captcha text (non case sensitive)
                if (
                    message.content.toLowerCase() ===
                    captcha.text?.toLowerCase()
                ) {
                    // If role is undefined
                    if (role == undefined) {
                        await member.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(
                                        "Captcha verification successful, but couldn't find verification role. Please contact a staff member."
                                    )
                                    .setColor(client.config.colors.succesful),
                            ],
                        });
                        collector.stop();
                        return resolve({
                            passed: true,
                            reason: "Verification succesful.",
                        });
                    }

                    if (currentAttempts <= maxAttempts - 1) {
                        collector.stop();
                    }

                    member.roles.add(role);
                    member.send({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(
                                    "Captcha verification successful."
                                )
                                .setColor(client.config.colors.succesful),
                        ],
                    });
                    collector.stop();
                    return resolve({
                        passed: true,
                        reason: "Verification succesful.",
                    });
                } else {
                    if (currentAttempts >= maxAttempts) {
                        await member.kick("Verification failed.");
                        await member.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.config.colors.failed)
                                    .setDescription(
                                        "Captcha verification failed: Too many attempts."
                                    ),
                            ],
                        });
                        return resolve({
                            passed: false,
                            reason: "Verification failed. Too many attempts.",
                        });
                    } else {
                        await member.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.config.colors.failed)
                                    .setDescription(
                                        "Incorrect response, please try again."
                                    ),
                            ],
                        });
                    }
                }
            });

            collector?.on("end", async (_, reason) => {
                if (reason === "time") {
                    await member.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.config.colors.failed)
                                .setDescription(
                                    "Captcha verification failed: Timed out."
                                ),
                        ],
                    });
                    await member.kick(
                        "Captcha verification failed: Timed out."
                    );
                    return resolve({
                        passed: false,
                        reason: "Verification failed. Timed out",
                    });
                }
            });
        });

        return verificationResult;
    },
};
