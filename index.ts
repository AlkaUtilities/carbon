import dotenv from 'dotenv';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { load_events } from './handlers/event_handler';
import { Logger } from './utilities';
import {} from './typings/discord';

dotenv.config();

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

Logger.Info("Configuring client")
// NOTE All intents code: 131071
// using all intents is NOT a good practice.
// However it can be annoying trying to fix an error caused by not having the right intent
// because it doesnt tell you that you dont have the right intent to do something 
const client = new Client({
    // intents: 131071, // all intents
    intents:  [ Guilds, GuildMembers, GuildMessages ],
    partials: [ User, Message, GuildMember, ThreadMember ]
});
Logger.Info("Configured client")

Logger.Info("Setting up collections")

client.events = new Collection();
client.commands = new Collection();

Logger.Info("Collections is ready")

load_events(client);

const clock = setInterval(() => {
    Logger.Info("this is a clock");
}, 500);

client.login(process.env.TOKEN);