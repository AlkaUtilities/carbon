import {
    GuildMember,
    EmbedBuilder,
    Client,
    AttachmentBuilder,
    Events,
} from "discord.js";
import { CaptchaGenerator } from "captcha-canvas";
import GuildSchema from "../../schemas/guilds";

export const event = {
    name: Events.GuildMemberAdd,
    once: false,
    friendlyName: "Captcha",
    async execute(member: GuildMember, client: Client) {
        const guild = await GuildSchema.findOne({
            GuildID: member.guild.id,
        }).select("Settings.Modules.JoinGate.Captcha Settings.MainRoleID");

        // Return if guild document is not found
        if (!guild) return;

        console.log(guild);

        const module = guild.Settings?.Modules?.JoinGate?.Captcha;

        // Return if module is not found or disabled
        if (!module || !module.Enabled) return;

        // Return if the member isn't kickable or is a bot
        if (!member.kickable || member.user.bot) return;

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
                `Please type the captcha below to be able to access **${member.guild.name}**. Captcha is not case sensitive.`
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
            });

        const collector = member.dmChannel?.createMessageCollector({
            filter: (message) => message.author.id === member.id,
            time: 120000,
            max: 3,
        });

        const maxAttempts = module.MaxAttempts;
        let currentAttempts = 0;

        const roleID = guild.Settings?.MainRoleID;
        const role = roleID ? member.guild.roles.cache.get(roleID) : undefined;

        collector?.on("collect", async (message) => {
            currentAttempts++;

            // If message content is equal to captcha text (non case sensitive)
            if (message.content.toLowerCase() === captcha.text?.toLowerCase()) {
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
                                .setDescription(
                                    "Captcha verification failed: Too many attempts."
                                ),
                        ],
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
                await member.kick("Captcha verification failed: Timed out.");
            }
        });
    },
};
