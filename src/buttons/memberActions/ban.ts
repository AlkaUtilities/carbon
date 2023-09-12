import { ButtonInteraction, Client, EmbedBuilder } from "discord.js";

module.exports = {
    id: "userBan",
    async execute(interaction: ButtonInteraction, client: Client, args: any[]) {
        const memberId = args[0];

        const target = interaction.guild?.members.cache.get(memberId);

        if (!target)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Unable to find member with the id of ${memberId}.`,
                        })
                        .setColor(client.config.colors.failed),
                ],
                ephemeral: true,
            });
        // return interaction.reply({
        //     content: `Unable to find member with the id of \`${memberId}\`.`,
        //     ephemeral: true,
        // });

        if (!target.bannable)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Target is not bannable.`,
                        })
                        .setColor(client.config.colors.failed),
                ],
                ephemeral: true,
            });
        // return interaction.reply({
        //     content: `Target is not bannable.`,
        //     ephemeral: true,
        // });

        target
            .ban({
                deleteMessageSeconds: 0,
                reason: `Banned by ${
                    interaction.user.username +
                    (interaction.user.discriminator !== "0"
                        ? ` #${interaction.user.discriminator}`
                        : "")
                } (${interaction.user.id})`,
            })
            .then((m) => {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Sucessfully banned ${
                            m.user.username +
                            (m.user.discriminator !== "0"
                                ? ` #${m.user.discriminator}`
                                : "")
                        } from the server.`,
                    })
                    .setColor(client.config.colors.succesful);
                interaction.reply({
                    embeds: [embed],
                });
            })
            .catch((err) => {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Unable to ban member from the server.`,
                    })
                    .setColor(client.config.colors.failed);
                interaction.reply({
                    embeds: [embed],
                });
            });
    },
};
