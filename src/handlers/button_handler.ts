import { Client } from "discord.js";
import { load_files } from "../functions/file_loader";
import chalk from "chalk";

/**
 * Loads buttons in directory ".\/buttons\/\*\*\/*.ts"
 *
 * Must be called **after** defining client.buttons
 * @param client
 */
async function load_buttons(client: Client) {
    await client.buttons.clear(); // deletes all item in client.buttons collection

    const files = await load_files("buttons");

    let i = 0;

    const cwd = process.cwd().replace(/\\/g, "/") + "/";

    for (const file of files) {
        i++;
        console.log(
            chalk.green(`[HANDLER] Loading button files: `) +
                chalk.yellow(`${i.toString()}/${files.length}`) +
                chalk.green(` (${file.replace(cwd, "")})`)
        );

        const button = require(file);
        if (!button.id) return;

        client.buttons.set(button.id, button);
    }

    console.log(chalk.green("[HANDLER] Loaded button files"));
}

export { load_buttons };
