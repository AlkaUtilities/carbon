import {
    ChatInputCommandInteraction,
    Client,
    ChannelType,
    Message,
} from "discord.js";
import ms from "ms";

module.exports = {
    subCommand: "slowmode.set",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        await interaction.deferReply();
        const { channel, options } = interaction;
        if (!channel || channel.type === ChannelType.DM) return;
        const minRate = ms("1s");
        const maxRate = ms("6h");
        const minDuration = ms("10s");
        const rate =
            options.getString("rate", true) &&
            ms(options.getString("rate", true))
                ? ms(options.getString("rate", true))
                : 0;
        const duration =
            options.getString("duration") &&
            ms(options.getString("duration") || "")
                ? ms(options.getString("duration") || "")
                : 0;
        const reason = options.getString("reason") || "No reason provided.";
        let response = `${
            duration
                ? `Slowmode has been enabled with a rate of ${ms(rate, {
                      long: true,
                  })} per message for ${ms(duration, { long: true })}`
                : `Slowmode has been enabled with a rate of ${ms(rate, {
                      long: true,
                  })} per message`
        }\nReason: ${reason}`;

        // if (!rate) {
        //     channel.rateLimitPerUser ? response = `Slowmode has been disabled.` : response = `Slowmode has been enabled with a rate of ${ms(minRate, {long: true,})} per message.`;
        //     channel.rateLimitPerUser ? channel.setRateLimitPerUser(0) : channel.setRateLimitPerUser(5);
        //     message = await interaction.reply({
        //         content: response,
        //         fetchReply: true
        //     });
        //     return setTimeout(() => message.delete().catch(() => { }), 10000);
        // }

        if (rate < minRate || rate > maxRate) {
            return interaction.editReply({
                content: `Rate must be between ${ms(minRate, {
                    long: true,
                })} and ${ms(maxRate, {
                    long: true,
                })}. The rate can be supplied like so: *10s, 1m, 2h*, etc., or alternatively in milliseconds.`,
                // fetchReply: true,
                // ephemeral: true,
            });
        }

        if (duration && duration < minDuration) {
            return interaction.editReply({
                content: `Duration must be at least ${ms(minDuration, {
                    long: true,
                })}. The duration can be supplied like so: *10s, 1m, 2h*, etc., or alternatively in milliseconds.`,
                // fetchReply: true,
                // ephemeral: true,
            });
        }

        channel.setRateLimitPerUser(rate / 1000, reason);
        await interaction.editReply({
            content: response,
            // fetchReply: true
        });
        // setTimeout(() => message.delete().catch(() => { }), 10000);

        if (duration)
            setTimeout(async () => {
                channel.setRateLimitPerUser(0);
                interaction.editReply({
                    content: "Slowmode disabled.",
                    // fetchReply: true,
                });
            }, duration);
    },
};
