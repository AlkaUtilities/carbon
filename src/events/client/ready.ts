import chalk from "chalk";
import { Client, Events } from "discord.js";
import { load_commands } from "../../handlers/command_handler";

export const event = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        console.log(
            chalk.green(
                `[CLIENT] Logged in as ${chalk.yellow(client.user?.tag)}`
            )
        );

        load_commands(client, true).then(() => {
            if (process.argv[2] === "--test") process.exit(0);
        });
    },
};
