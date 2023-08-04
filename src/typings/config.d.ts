import { ColorResolvable } from "discord.js";

/** Strings used in logs */
interface CLIInterface {
    /** String to represent that something succeded */
    status_ok: string;

    /** String to represent that something failed */
    status_bad: string;
}

interface LogInterface {
    enabled: boolean;
    filePath: string;
}

/** Custom emojis used in messages/embeds */
interface IconsInterface {
    loading: string;

    /** Used to represent the database status for connecting/disconnecting */
    sync: string;

    /** Used to represent true */
    true: string;

    /** Used to represent false */
    false: string;

    bot: {
        /** Used as prefix for the username in [`/about user`](src/commands/misc/about/about.user.ts) if the user's id is included in `developersId` */
        developer: string;
    };

    server: {
        /** Used as prefix for the username in [`/about user`](src/commands/misc/about/about.user.ts) if the user is the owner of the guild */
        owner: string;
        /** Used as prefix for the server name in [`/about server`](src/commands/misc/about/about.server.ts) if the server is verified */
        verified: string;
        /** Used as prefix for the server name in [`/about server`](src/commands/misc/about/about.server.ts) if the server is partnered */
        partnered: string;
    };

    alka: {
        /** Used as prefix for the username in in [`/about user`](src/commands/misc/about/about.user.ts) if the user is a custom bot made for Alka Hangout */
        bot: string;
    };
}

interface AlkaInterface {
    /** The user ids of bots custom made for Alka Hangout (icons -> alka -> bot will be displayed as a prefix) */
    bots: string[];
}

/** OAuth2 settings */
interface OAuth2Interface {
    /** Client ID */
    clientId: string;

    /** OAuth2 redirect url */
    redirect: string;
}

/** Colors used in embeds */
interface ColorsInterface {
    /** Bot theme color */
    theme: ColorResolvable;

    /** Color to represent that something succeded */
    succesful: ColorResolvable;

    /** Color to represent that something failed */
    failed: ColorResolvable;
}

interface ConfigInterface {
    cli: CLIInterface;
    log: LogInterface;

    /** The user id of the bot owner */
    ownerId: string;

    /** The user ids of the bot developers */
    developersId: string[];

    /**Guild that will be used for testing
     *
     *Commands marked as `DEV` will be set here*/
    devGuildId: string;

    /** Main guild */
    mainGuildId: string;
    icons: IconsInterface;
    alka: AlkaInterface;
    oauth2: OAuth2Interface;
    colors: ColorsInterface;
}

export {
    CLIInterface,
    LogInterface,
    IconsInterface,
    AlkaInterface,
    OAuth2Interface,
    ConfigInterface,
};
