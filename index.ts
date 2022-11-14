import dotenv from "dotenv";
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { connect } from "mongoose";
import chalk from "chalk";
import { load_events } from "./handlers/event_handler";
import anticrash from "./handlers/anticrash";
// import { Logger } from './utilities';
import config from "./config";

// Import typings cause intellisense sucks
import {} from "./typings/discord";
import {} from "./typings/enviroment";

// Logger.Info("Configuring enviroment variables");
dotenv.config({ path: __dirname + "/.env" });
// Logger.Info("Configured enviroment variables");

// Logger.Info("Configuring client");
const { Guilds, GuildMembers, GuildMessages, GuildPresences, DirectMessages } =
    GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

// NOTE Dont use all intent
// It could slow the bot down
// However if you're debugging and wondering if invalid intent
// is the problem to your problem:
// All intents code is 131071

const client = new Client({
    // intents: 131071, // all intents
    intents: [
        Guilds,
        GuildMembers,
        GuildMessages,
        GuildPresences,
        DirectMessages,
    ],
    partials: [User, Message, GuildMember, ThreadMember],
});
// Logger.Info("Configured client");

// Logger.Info("Configuring anticrash");
anticrash(client, process.env.ANTICRASH_WEBHOOKURL);
// Logger.Info("Configured anticrash");

// Logger.Info("Configuring collections");
// Collections (Discord.Collection)
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

// Configs (objects)
client.config = config;
client.icon = config.icons;
// Logger.Info("Configured collections");

load_events(client);

// Logger.Info("Logging in");
client.login(process.env.TOKEN);

// Logger.Info("Connecting to database")
console.log(chalk.green("[MONGOOSE] Connecting to database..."));
connect(process.env.MONGODB_SRV, () => {
    // Logger.Info("Connected to MongoDB")
    console.log(chalk.green("[MONGOOSE] Connected to database."));
});
