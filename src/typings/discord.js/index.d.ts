import { Collection } from "discord.js";
import { ConfigInterface, IconsInterface } from "../config";

// Extends the client to show "client.commands", "client.events", and some other as valid properties from Client
declare module "discord.js" {
    interface Client {
        /** Client config */
        config: ConfigInterface;

        /** Icons */
        icon: IconsInterface;

        /** Commands */
        commands: Collection<unknown, any>;

        /** Sub commands */
        subCommands: Collection<unknown, any>;

        /** Events */
        events: Collection<unknown, any>;

        /** Buttons */
        buttons: Collection<unknown, any>;
    }
}

export {};
