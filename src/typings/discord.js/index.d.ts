import { Collection } from "discord.js";
import { Config, Icons } from "../config";

// Extends the client to show "client.commands", "client.events", and some other as valid properties from Client
declare module "discord.js" {
    interface Client {
        commands: Collection<unknown, any>;
        subCommands: Collection<unknown, any>;
        events: Collection<unknown, any>;
        config: Config;
        icon: Icons;
    }
}

export {};
