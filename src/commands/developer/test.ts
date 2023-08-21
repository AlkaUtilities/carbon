import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
module.exports = {
    name: "test",
    disabled: false, // is the command disabled?
    hasESub: false, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developer: true, // is command developer only?
    data: new SlashCommandBuilder().setName("test").setDescription("test"),
    execute(interaction: ChatInputCommandInteraction, client: Client) {
        const button = new ButtonBuilder()
            .setLabel("test")
            .setCustomId(`test.${interaction.guildId}`)
            .setStyle(ButtonStyle.Primary);
        const actionrow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            button
        );
        interaction.reply({
            content: "test",
            components: [actionrow],
        });
    },
};
