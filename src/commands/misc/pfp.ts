// thanks kyhri (https://github.com/kyhrii) for the idea

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
} from "discord.js";

module.exports = {
    name: "pfp",
    disabled: false, // is the command disabled?
    hasExternalSubcommand: true, // does the command has an external sub command?
    initialReply: false, // does command execute with an initial reply?
    developer: false, // is command developer only?
    data: new SlashCommandBuilder()
        .setName("pfp")
        .setDescription("Steals a user's pfp")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User to steal profile picture")
                .setRequired(true)
        ),
    execute(interaction: ChatInputCommandInteraction, client: Client) {
        const user = interaction.options.getUser("user", true);
        const avatarURL = user.displayAvatarURL();

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}`)
            .setDescription(`[Display Avatar](${avatarURL})`)
            .setThumbnail(avatarURL)
            .setColor(user.hexAccentColor || `#4cbd49`);

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
