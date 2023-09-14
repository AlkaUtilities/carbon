import { Client, SlashCommandSubcommandBuilder } from "discord.js";
import { load_files } from "../functions/file_loader";
import Table from "cli-table";
import chalk from "chalk";

export type CommandExecute = (...args: [...any: any[], client: Client]) => void;

export interface Command {
    ignore: boolean;
    name: string;
    subCommand?: string;
    disabled?: boolean;
    initialReply?: boolean;
    hasExternalSubcommand?: boolean;
    developerOnly?: boolean;
    global?: boolean;
    data: SlashCommandSubcommandBuilder;
    execute: CommandExecute;
}

export interface SubCommand {
    ignore: boolean;
    subCommand: string;
    disabled?: boolean;
    initialReply?: boolean;
    developerOnly?: boolean;
    execute: CommandExecute;
}

export interface CommandFile {
    // command?: Command | SubCommand;
    command?: Command;
}

/**
 * Loads commands in directory ".\/events\/\*\*\/\*.ts"
 *
 * Must be called **after** defining client.commands
 * @param client
 */
export async function load_commands(client: Client, global: Boolean = false) {
    const table = new Table({
        head: ["#", "Command Name", "Type", "Status"],
        colWidths: [4, 26, 8, 8],
        chars: {
            mid: "",
            "left-mid": "",
            "mid-mid": "",
            "right-mid": "",
        },
    });

    const devGuild = client.guilds.cache.get(client.config.devGuildId);

    if (!devGuild) {
        return console.log(chalk.red(`[HANDLER] Dev guild not found!`));
    }

    await client.commands.clear();
    await client.subCommands.clear();

    let globalCommands: any[] = [];
    let devCommands: any[] = [];

    const files = await load_files("commands");

    let validCommands = 0;
    let invalidCommands = 0;
    let subCommands = 0;

    let i = 0;

    const cwd = process.cwd().replace(/\\/g, "/") + "/";

    for (const file of files) {
        i++;
        // process.stdout.write(
        //     chalk.green(`[HANDLER] Loading command files: `) +
        //         chalk.yellow(`${i}/${files.length}`) +
        //         "\r"
        // );

        console.log(
            chalk.green(`[HANDLER] Loading command files: `) +
                chalk.yellow(`${i.toString()}/${files.length}`) +
                chalk.green(` (${file.replace(cwd, "")})`)
        );
        const { command }: CommandFile = require(file);

        if (!command) continue;

        if (command.ignore) continue;

        if (!("data" in command) && !("subCommand" in command)) {
            table.push([
                i.toString(),
                chalk.red(file.split("/").pop() || "unknown"),
                "",
                client.config.cli.status_bad,
            ]);
            invalidCommands++;
            continue;
        }

        if (command.subCommand) {
            client.subCommands.set(command.subCommand, command);
            table.push([
                i.toString(),
                command.subCommand,
                chalk.magenta("SUB"),
                client.config.cli.status_ok,
            ]);
            subCommands++;
            continue;
        }
        // command.data.name is for slash commands using the SlashCommandBuilder()
        client.commands.set(command.data.name, command);
        validCommands++;

        if (command.global) {
            globalCommands.push(command.data.toJSON());
            table.push([
                i.toString(),
                command.data.name,
                chalk.blue("GLOBAL"),
                client.config.cli.status_ok,
            ]);
        } else if (command.global && global === false) {
            continue; // if command is global but global is false
        } else {
            devCommands.push(command.data.toJSON());
            table.push([
                i.toString(),
                command.data.name,
                chalk.yellow("DEV"),
                client.config.cli.status_ok,
            ]);
        }
    }

    console.log(table.toString());

    // Uncomment the line under this comment to enable global slash command
    if (global) {
        await client.application?.commands
            .set(globalCommands)
            .then((commands) => {
                console.log(
                    `Updated ${commands.size} ${chalk.blue(
                        chalk.bold("global")
                    )} commands`
                );
            });
    } else console.log(`Global commands were ${chalk.red(`not updated`)}`);

    await devGuild.commands.set(devCommands).then((commands) => {
        console.log(
            `Updated ${commands.size} ${chalk.yellow(
                chalk.bold("guild")
            )} commands`
        );
    });
}
