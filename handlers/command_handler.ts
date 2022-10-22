import { Client } from "discord.js";
import { load_file } from "../functions/file_loader";
import Table from "cli-table";
import config from "../config";
import chalk from 'chalk';
import { Logger, TryReadString } from "../utilities";

/**
 * Loads commands in directory ".\/events\/\*\*\/\*.ts"
 * 
 * Must be called **after** defining client.commands
 * @param client 
 */
async function load_commands(client:Client) {
    Logger.Info("Loading commands")
    const table = new Table({
        head: ["Command Name", "Type", "Status"],
        colWidths: [18, 8, 8],
        chars: {
            'mid': '', 
            'left-mid': '', 
            'mid-mid': '', 
            'right-mid': ''
        }
    });

    const devGuild = client.guilds.cache.get(config.devGuildId);

    if (!devGuild) {
        Logger.Error(`Developer guild not found. Guild id ${config.devGuildId}`);
        return;
    }

    await client.commands.clear();

    let globalCommands: any[] = [];
    let devCommands: any[] = [];

    const files = await load_file("commands");

    let validCommands = 0;
    let invalidCommands = 0;

    for (const file of files) {
        const command = require(file);

        if (!('data' in command)) {
            table.push([(file.split('/').pop() || 'unknown'),'', config.cli.status_bad]);
            invalidCommands++
            Logger.Warn(`Invalid command found: ${file}`);
            continue;
        }

        // NOTE: command.data.name is for slash commands using the SlashCommandBuilder()
        client.commands.set(command.data.name, command);
        validCommands++
        
        if (command.global) {
            globalCommands.push(command.data.toJSON());
            table.push([ command.data.name, 'GLOBAL', config.cli.status_ok ])
            Logger.Warn(`[GLOBAL] Command set: ${command.data.name}`);
        } else {
            devCommands.push(command.data.toJSON());
            table.push([ command.data.name, 'DEV', config.cli.status_ok ])
            Logger.Warn(`[DEV]    Command set: ${command.data.name}`);
        }
    }

    // NOTE: Uncomment the line under this comment to enable global slash command
    // client.application?.commands.set(globalCommands) // this is dangerous

    devGuild.commands.set(devCommands);

    console.log(table.toString());
    Logger.Info(`Found ${table.length} commands. valid: ${validCommands}. invalid: ${invalidCommands}.`);
}

export { load_commands };