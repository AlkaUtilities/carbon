import { ChannelType, ChatInputCommandInteraction, Client } from "discord.js";
import ms from "ms";

module.exports = {
    subCommand: "slowmode.disable",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        const { channel, options } = interaction;
        if (!channel || channel.type === ChannelType.DM) return;
        if (channel.rateLimitPerUser === 0)
            return interaction.reply({
                content: "Slowmode is already disabled.",
            });
        const minDuration = ms("10s");
        const duration =
            options.getString("duration") &&
            ms(options.getString("duration") || "")
                ? ms(options.getString("duration") || "")
                : 0;
        const reason = options.getString("reason") || "No reason provided.";
        let response = `${
            duration
                ? `Slowmode has been disabled for ${ms(duration, {
                      long: true,
                  })}`
                : `Slowmode has been disabled`
        }\nReason: ${reason}`;

        const previousRate = channel.rateLimitPerUser || 0;

        if (duration && duration < minDuration) {
            return interaction.reply({
                content: `Duration must be at least ${ms(minDuration, {
                    long: true,
                })}. The duration can be supplied like so: *10s, 1m, 2h*, etc., or alternatively in milliseconds.`,
                fetchReply: true,
                ephemeral: true,
            });
        }

        channel.setRateLimitPerUser(0, reason);
        await interaction.reply({ content: response, fetchReply: true });

        if (duration && previousRate > 0)
            setTimeout(async () => {
                channel.setRateLimitPerUser(previousRate);
                interaction.editReply({
                    content: `Slowmode has been enabled with a rate of ${previousRate} per message`,
                    // fetchReply: true,
                });
            }, duration);
    },
};
