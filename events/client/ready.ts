import chalk from "chalk";
import { Client } from "discord.js";
import { load_commands } from '../../handlers/command_handler';
// import { Logger } from "../../utilities";

module.exports = {
    name: "ready",
    once: true,
    execute(client:Client) {
        // Logger.Info("Client is ready")
        console.log(chalk.green(`[CLIENT] Logged in as ${chalk.yellow(client.user?.tag)}`))

        load_commands(client);
    }
};