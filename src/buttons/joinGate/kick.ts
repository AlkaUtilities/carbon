import { ButtonInteraction, Client, EmbedBuilder } from "discord.js";

module.exports = {
    id: "joinGateLogKick",
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

        if (!target.kickable)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Target is not kickable.`,
                        })
                        .setColor(client.config.colors.failed),
                ],
                ephemeral: true,
            });
        // return interaction.reply({
        //     content: `Target is not kickable.`,
        //     ephemeral: true,
        // });

        target
            .kick(
                `Kicked by ${
                    interaction.user.username +
                    (interaction.user.discriminator !== "0"
                        ? ` #${interaction.user.discriminator}`
                        : "")
                } (${interaction.user.id}) from the user join log.`
            )
            .then((m) => {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Sucessfully kicked ${
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
                        name: `Unable to kick member from the server.`,
                    })
                    .setColor(client.config.colors.failed);
                interaction.reply({
                    embeds: [embed],
                });
            });
    },
};
