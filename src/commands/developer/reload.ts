import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
} from "discord.js";
import { load_commands } from "../../handlers/command_handler";
import { load_events } from "../../handlers/event_handler";

export const command = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads the bot")
        .setDMPermission(false)
        .addSubcommand((o) =>
            o
                .setName("commands")
                .setDescription("Reloads all commands and subcommands")
                .addBooleanOption((boolean) =>
                    boolean
                        .setName("global")
                        .setDescription("Reload global commands?")
                )
        )
        .addSubcommand((o) =>
            o.setName("events").setDescription("Reloads all events")
        ),
    initialReply: true,
    developerOnly: true,
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        switch (interaction.options.getSubcommand()) {
            case "commands":
                {
                    const global =
                        interaction.options.getBoolean("global") || true;
                    await load_commands(client, global).then(async () => {
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
