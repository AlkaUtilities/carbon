import { Client } from "discord.js";
import { load_file } from "../functions/file_loader";
import Table from "cli-table";
import chalk from 'chalk';
import config from "../config";
// import { Logger } from "../utilities";
import {} from '../typings/discord';

/**
 * Loads commands in directory ".\/events\/\*\*\/\*.ts"
 * 
 * Must be called **after** defining client.commands
 * @param client 
 */
async function load_commands(client:Client) {
    // Logger.Info("Loading commands")
    const table = new Table({
        head: ["Command Name", "Type", "Status"],
        colWidths: [26, 8, 8],
        chars: {
            'mid': '', 
            'left-mid': '', 
            'mid-mid': '', 
            'right-mid': ''
        }
    });

    const devGuild = client.guilds.cache.get(config.devGuildId);

    if (!devGuild) {
        // Logger.Error(`Developer guild not found. Guild id ${config.devGuildId}`);
        return;
    }

    await client.commands.clear();
    await client.subCommands.clear();

    let globalCommands: any[] = [];
    let devCommands: any[] = [];

    const files = await load_file("commands");

    let validCommands   = 0;
    let invalidCommands = 0;
    let subCommands     = 0;

    let i = 0;
    for (const file of files) {
        i++
        process.stdout.write(chalk.green(`[HANDLER] Loading command files: `) + chalk.yellow(`${i}/${files.length}`) + '\r');
        const command = require(file);

        if (command.ignore) {
            // Logger.Info(`Ignored ${file} because it had an 'ignore' property with value true`)
            continue;
        }

        if (!('data' in command) && !('subCommand' in command)) {
            table.push([(chalk.red(file.split('/').pop() || 'unknown')),'', config.cli.status_bad]);
            invalidCommands++
            // Logger.Warn(`Invalid command found: ${file}`);
            continue;
        }

        if (command.subCommand) {
            client.subCommands.set(command.subCommand, command);
            table.push([command.subCommand, chalk.magenta('SUB'), config.cli.status_ok]);
            subCommands++;
            continue;
        }
        // NOTE: command.data.name is for slash commands using the SlashCommandBuilder()
        client.commands.set(command.data.name, command);
        validCommands++
        
        if (command.global) {
            globalCommands.push(command.data.toJSON());
            table.push([ command.data.name, chalk.blue('GLOBAL'), config.cli.status_ok ])
            // Logger.Info(`[GLOBAL] Command set: ${command.data.name}`);
        } else {
            devCommands.push(command.data.toJSON());
            table.push([ command.data.name, chalk.yellow('DEV'), config.cli.status_ok ])
            // Logger.Info(`[DEV]    Command set: ${command.data.name}`);
        }
    }

    console.log(table.toString());

    // NOTE: Uncomment the line under this comment to enable global slash command
    // await client.application?.commands.set(globalCommands) // this is dangerous

    await devGuild.commands.set(devCommands).then((commands) => {
        // Logger.Info(`Updated ${commands.size} root commands (excludes subcommands)`);
        console.log(`Updated ${commands.size} ${chalk.bold('root')} commands`);
    });

    // Logger.Info(`Found ${table.length} commands. valid: ${validCommands}. invalid: ${invalidCommands}.`);
}

export { load_commands };