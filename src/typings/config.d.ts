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

    /** Used to represent unknown values  */
    unknown: string;

    /** Shield icons */
    shield: {
        checkmark: string;
        cancel: string;
        exclamation_yellow: string;
        exclamation_red: string;
    };
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

    /** Colors to represent that something bad happened (not failed) */
    bad: ColorResolvable;

    /** Colors to represent warnings */
    warning: ColorResolvable;
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
    OAuth2Interface,
    ConfigInterface,
};
