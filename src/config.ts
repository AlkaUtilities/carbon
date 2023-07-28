import yaml from "js-yaml";
import fs from "fs";
import { Config } from "./typings/config";
import { Client } from "discord.js";

/**
 * Config file path
 */
const filePath = "./config.yaml";

/**
 * Reloads `client.config` and `client.icon`
 * @param client Discord.js client
 */
function reloadClient(client: Client): void {
    const config = load();

    client.config = config;
    client.icon = config.icons;
}

/**
 * Loads config
 * @param path Path to config (optional)
 * @returns Config object
 */
function load(path: string = filePath): Config {
    return yaml.load(fs.readFileSync(filePath, "utf-8")) as Config;
}

/**
 * Saves object to config file.
 * @param config Config object
 */
function save(config: Config, path: string = filePath): void {
    const yamlString = yaml.dump(config, {
        forceQuotes: true,
        indent: 4,
        quotingType: '"',
        skipInvalid: true,
    });

    fs.writeFileSync(filePath, yamlString, "utf-8");
}

export default { save, load, reloadClient };
