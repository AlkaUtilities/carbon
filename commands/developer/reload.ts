import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
} from "discord.js";
import { load_commands } from "../../handlers/command_handler";
import { load_events } from "../../handlers/event_handler";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads the bot")
        .setDMPermission(false)
        .addSubcommand((o) =>
            o
                .setName("commands")
                .setDescription("Reloads all commands and subcommands")
        )
        .addSubcommand((o) =>
            o.setName("events").setDescription("Reloads all events")
        ),
    initialReply: true,
    developer: true,
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        switch (interaction.options.getSubcommand()) {
            // TODO Reload events
            case "commands":
                {
                    await load_commands(client).then(async () => {
                        await interaction.followUp(
                            "Reloaded commands and subcommands."
                        );
                    });
                    return;
                }
                break;

            case "events":
                {
                    for (const [key, value] of client.events) {
                        client.removeListener(`${key}`, value);
                    }
                    load_events(client);
                    await interaction.followUp("Reloaded events.");
                }
                break;
        }
    },
};
