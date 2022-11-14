import { Client } from "discord.js";
import { load_file } from "../functions/file_loader";
import Table from "cli-table";
import config from "../config";
// import { Logger } from "../utilities";
import {} from "../typings/discord";
import chalk from "chalk";

/**
 * Loads events in directory ".\/events\/\*\*\/*.ts"
 *
 * Must be called **after** defining client.events
 * @param client
 */
async function load_events(client: Client) {
    // Logger.Info("Loading events")
    const table = new Table({
        head: ["Event Name", "Status"],
        colWidths: [26, 8],
        chars: {
            mid: "",
            "left-mid": "",
            "mid-mid": "",
            "right-mid": "",
        },
    });

    await client.events.clear(); // deletes all item in client.events collection

    const files = await load_file("events");

    let validEvents = 0;
    let invalidEvents = 0;

    let i = 0;
    for (const file of files) {
        i++;
        process.stdout.write(
            chalk.green(`[HANDLER] Loading event files: `) +
                chalk.yellow(`${i}/${files.length}`) +
                "\r"
        );
        const event = require(file);
        if (!event.name) {
            // check if file has property "name"
            table.push([
                event.friendlyName
                    ? chalk.blue(event.friendlyName)
                    : event.name
                    ? event.name
                    : file.split("/").pop(),
                config.cli.status_bad,
            ]);
            invalidEvents++;
            // Logger.Warn(`Invalid event found: ${file}`);
            continue;
        }

        const execute = (...args: any[]) => event.execute(...args, client);
        client.events.set(event.name, execute);
        validEvents++;
        // Logger.Info(`Event set: ${event.name}`);

        if (event.rest) {
            if (event.once) client.rest.once(event.name, execute); // rest, once
            else client.rest.on(event.name, execute); // rest, on
        } else if (!event.rest) {
            if (event.once) client.once(event.name, execute); // normal, once
            else client.on(event.name, execute); // normal on
        }

        table.push([
            event.friendlyName
                ? chalk.blue(event.friendlyName)
                : event.name
                ? event.name
                : file.split("/").pop(),
            config.cli.status_ok,
        ]);
    }
    // Logger.Info(`Found ${table.length} events. valid: ${validEvents}. invalid: ${invalidEvents}.`);

    console.log(table.toString());
}

export { load_events };
