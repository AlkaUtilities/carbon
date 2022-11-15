import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
} from "discord.js";
import GuildLevelingSetting from "../../schemas/guildLevelingSetting";

module.exports = {
    name: "leveling",
    disabled: false, // is the command disabled?
    hasESub: false, // does the command has an external sub command?
    initialeditReply: false, // does command execute with an initial editReply?
    developer: false, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("leveling")
        .setDescription("Configure leveling system for your guild")
        .setDMPermission(false)
        .addSubcommand((option) =>
            option
                .setName("toggle")
                .setDescription("Enable/disable leveling plugin")
                .addBooleanOption((bool) =>
                    bool
                        .setName("enabled")
                        .setDescription("Enable leveling plugin?")
                )
        )
        .addSubcommandGroup((option) =>
            option
                .setName("xp")
                .setDescription("Configure XP settings")
                .addSubcommand((sub) =>
                    sub
                        .setName("multiplier")
                        .setDescription("Set XP multiplier")
                        .addNumberOption((num) =>
                            num
                                .setName("multiplier")
                                .setDescription("XP multiplier (Default: 1)")
                                .setRequired(true)
                        )
                )
                .addSubcommand((sub) =>
                    sub
                        .setName("interval")
                        .setDescription(
                            "Set the interval between XP increments"
                        )
                        .addNumberOption((num) =>
                            num
                                .setName("interval")
                                .setDescription(
                                    "Set the interval between XP increments in seconds (Default: 60)"
                                )
                                .setRequired(true)
                        )
                )
        ),
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        await interaction.deferReply();
        const { options, guildId } = interaction;
        switch (options.getSubcommand()) {
            case "toggle":
                {
                    const toggle = options.getBoolean("enabled");
                    let GuildLevelingSettingData =
                        await GuildLevelingSetting.findOne({
                            GuildID: guildId,
                        });

                    if (!GuildLevelingSettingData) {
                        GuildLevelingSettingData =
                            await GuildLevelingSetting.create({
                                GuildID: guildId,
                                Enabled: toggle !== null ? toggle : true,
                            });
                        GuildLevelingSettingData.save();
                        return interaction.editReply({
                            content: "**Enabled leveling system**",
                        });
                    }

                    const enabled =
                        toggle !== null
                            ? toggle
                            : !GuildLevelingSettingData.Enabled;

                    if (GuildLevelingSettingData.Enabled == enabled) {
                        return interaction.editReply({
                            content: `**Error**: Leveling system is already set to ${
                                enabled ? "enabled" : "disabled"
                            }`,
                        });
                    }

                    GuildLevelingSettingData.updateOne({
                        $set: {
                            Enabled: enabled,
                        },
                    }).then(() =>
                        interaction.editReply({
                            content: enabled
                                ? "**Enabled leveling system**"
                                : "**Disabled leveling system**",
                        })
                    );
                }
                break;

            case "interval":
                {
                    const interval = options.getNumber("interval", true);
                    let GuildLevelingSettingData =
                        await GuildLevelingSetting.findOne({
                            GuildID: guildId,
                        });

                    if (
                        !GuildLevelingSettingData ||
                        !GuildLevelingSettingData.Enabled
                    ) {
                        return interaction.editReply({
                            content: `**Error**: Leveling is not enabled in this server. Enable it by using \`/leveling toggle\``,
                        });
                    }

                    if (interval < 0) {
                        return interaction.editReply({
                            content: `**Error**: Interval cannot be less than **0 second**\nSpecified interval: \`${interval} ${
                                interval > 1 ? "seconds" : "second"
                            }\``,
                        });
                    }

                    if (
                        GuildLevelingSettingData.XPIncrementInterval == interval
                    ) {
                        return interaction.editReply({
                            content: `**Error**: Multiplier is already set to **${interval} ${
                                interval > 1 ? "seconds" : "second"
                            }**`,
                        });
                    }

                    GuildLevelingSettingData.updateOne({
                        $set: {
                            XPIncrementInterval: interval,
                        },
                    }).then(() => {
                        interaction.editReply({
                            content: `Updated XP increment interval from **${
                                GuildLevelingSettingData?.XPIncrementInterval
                            } ${
                                GuildLevelingSettingData?.XPIncrementInterval !==
                                    undefined &&
                                GuildLevelingSettingData?.XPIncrementInterval >
                                    1
                                    ? "seconds"
                                    : "second"
                            }** to **${interval} ${
                                interval > 1 ? "seconds" : "second"
                            }**`,
                        });
                    });
                }
                break;

            case "multiplier":
                {
                    const multiplier = options.getNumber("multiplier", true);
                    let GuildLevelingSettingData =
                        await GuildLevelingSetting.findOne({
                            GuildID: guildId,
                        });

                    if (
                        !GuildLevelingSettingData ||
                        !GuildLevelingSettingData.Enabled
                    ) {
                        return interaction.editReply({
                            content: `**Error**: Leveling is not enabled in this server. Enable it by using \`/leveling toggle\``,
                        });
                    }

                    if (multiplier < 0.1) {
                        return interaction.editReply({
                            content: `**Error**: Multiplier cannot be less than **0.1x**\nSpecified multiplier: \`${multiplier}x\``,
                        });
                    }

                    if (GuildLevelingSettingData.XPMultiplier == multiplier) {
                        return interaction.editReply({
                            content: `**Error**: Multiplier is already set to **${multiplier}x**`,
                        });
                    }

                    GuildLevelingSettingData.updateOne({
                        $set: {
                            XPMultiplier: multiplier,
                        },
                    }).then((data) =>
                        interaction.editReply({
                            content: `Updated XP multiplier from **${GuildLevelingSettingData?.XPMultiplier}x** to **${multiplier}x**`,
                        })
                    );
                }
                break;
        }
        // interaction.editReply(`\`${interaction.options.getSubcommand()}\``);
    },
};
