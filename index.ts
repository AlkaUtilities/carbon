import dotenv from "dotenv";
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { connect } from "mongoose";
import chalk from "chalk";
import { load_events } from "./handlers/event_handler";
import anticrash from "./handlers/anticrash";
import config from "./config";

import {} from "./typings/discord";
import {} from "./typings/enviroment";

dotenv.config({ path: __dirname + "/.env" });
const { Guilds, GuildMembers, GuildMessages, GuildPresences, DirectMessages } =
    GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

// all intent: 131071

const client = new Client({
    intents: [
        Guilds,
        GuildMembers,
        GuildMessages,
        GuildPresences,
        DirectMessages,
    ],
    partials: [User, Message, GuildMember, ThreadMember],
});
anticrash(client, process.env.ANTICRASH_WEBHOOKURL);

// Configs (objects)
client.config = config;
client.icon = config.icons;

// Collections (Discord.Collection)
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

load_events(client);

client.login(process.env.TOKEN);

console.log(chalk.green("[MONGOOSE] Connecting to database..."));
connect(process.env.MONGODB_SRV, () => {
    console.log(chalk.green("[MONGOOSE] Connected to database."));
});
