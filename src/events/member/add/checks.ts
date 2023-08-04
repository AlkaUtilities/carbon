import { GuildMember, EmbedBuilder, Client, AttachmentBuilder } from "discord.js";
import GuildSchema from "../../../schemas/guilds";
import { CaptchaGenerator } from "captcha-canvas";

/**
 * Checks if the member's account age is older than the configured minimum account age
 * @param member
 * @param guildDocument GuildSchema
 * @returns
 */
async function checkMemberAccountAge(member: GuildMember, guildDocument: any) {
    if (!guildDocument) return true;

    const checks = guildDocument.Settings?.Modules?.UserJoin?.Checks;

    if (!checks?.AccountAge?.Enabled) return true;

    const timeSinceCreated = Date.now() - member.user.createdTimestamp;

    console.log(timeSinceCreated);

    const minimumAccountAge = 1000 * 60 * 60 * 24 * checks.AccountAge.MinimumAccountAge;

    if (timeSinceCreated >= minimumAccountAge) return true;

    switch (checks.AccountAge.Action) {
        case "kick":
            {
                const embed = new EmbedBuilder()
                    .setTitle(`You have been kicked from ${member.guild.name}`)
                    .setDescription(
                        `Your account must be older than **${checks.AccountAge.MinimumAccountAge} days** to join this server.`
                    );

                await member
                    .send({
                        embeds: [embed],
                    })
                    .catch(() => undefined);

                await member.kick(
                    `Your account must be older than ${checks.AccountAge.MinimumAccountAge} days to join this server.`
                );
            }
            break;

        case "ban":
            {
                const embed = new EmbedBuilder()
                    .setTitle(`You have been banned from ${member.guild.name}`)
                    .setDescription(
                        `Your account must be older than **${checks.AccountAge.MinimumAccountAge} days** to join this server.`
                    );

                await member
                    .send({
                        embeds: [embed],
                    })
                    .catch(() => undefined);

                await member.ban({
                    reason: `Your account must be older than ${checks.AccountAge.MinimumAccountAge} days to join this server.`,
                    deleteMessageSeconds: 0,
                });
            }
            break;
    }

    return false;
}

/**
 * Asks user to solve captcha
 * @param member
 * @param client
 * @param guild GuildSchema
 * @returns
 */
async function captcha(member: GuildMember, client: Client, guildDocument: any) {
    if (!guildDocument) return;

    const captchaModule = guildDocument.Settings?.Modules?.UserJoin?.Captcha;
    if (!captchaModule?.Enabled) return;

    if (!member.kickable) return;
    if (member.user.bot) return;

    const captcha = new CaptchaGenerator()
        .setDimension(150, 450)
        .setCaptcha({
            size: 60,
            color: client.config.colors.theme as string,
        })
        .setDecoy({
            opacity: 0.7,
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
        .setDescription(`Please type the captcha below to be able to access **${member.guild.name}**.`)
        .setFooter({ text: `Verification Period: 2 minutes` })
        .setImage(`attachment://captcha.png`);

    await member
        .send({
            embeds: [embed],
            files: [attachment],
        })
        .catch(() => {
            member.kick("User direct message are disabled.");
        });

    const collector = member.dmChannel?.createMessageCollector({
        filter: (message) => message.author.id === member.id,
        time: 120000,
        max: 3,
    });

    const maxAttempts = captchaModule?.MaxAttempts;
    let currentAttempts = 0;

    const roleID = guildDocument.Settings?.MainRoleID;
    const role = roleID ? member.guild.roles.cache.get(roleID) : undefined;

    collector?.on("collect", async (message) => {
        currentAttempts++;

        // If message content is equal to captcha text (non case sensitive)
        if (message.content.toLowerCase() === captcha.text?.toLowerCase()) {
            // If role is undefined
            if (!role) {
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                "Captcha verification successful, but couldn't find verification role. Please contact a staff member."
                            )
                            .setColor(client.config.colors.succesful),
                    ],
                });
                return;
            }

            if (currentAttempts <= maxAttempts - 1) {
                collector.stop();
            }

            member.roles.add(role);
            member.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Captcha verification successful.")
                        .setColor(client.config.colors.succesful),
                ],
            });
            collector.stop();
        } else {
            if (currentAttempts >= maxAttempts) {
                await member.kick("Verification failed.");
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.failed)
                            .setDescription("Captcha verification failed: Too many attempts"),
                    ],
                });
            } else {
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.failed)
                            .setDescription("Incorrect response, please try again."),
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
                        .setDescription("Captcha verification failed: Timed out"),
                ],
            });
            await member.kick("Captcha verification failed: Timed out");
        }
    });
}

export { checkMemberAccountAge, captcha };
