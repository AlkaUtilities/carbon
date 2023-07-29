interface CLIInterface {
    status_ok: string;
    status_bad: string;
}

interface LogInterface {
    enabled: boolean;
    filePath: string;
}

interface IconsInterface {
    loading: string;
    sync: string;
    true: string;
    false: string;
    bot: {
        developer: string;
    };
    server: {
        owner: string;
        verified: string;
        partnered: string;
    };
    alka: {
        bot: string;
    };
}

interface AlkaInterface {
    bots: string[];
}

interface OAuth2Interface {
    clientId: string;
    redirect: string;
}

interface ConfigInterface {
    cli: CLIInterface;
    log: LogInterface;
    ownerId: string;
    developersId: string[];
    devGuildId: string;
    mainGuildId: string;
    icons: IconsInterface;
    alka: AlkaInterface;
    oauth2: OAuth2Interface;
}

export {
    CLIInterface,
    LogInterface,
    IconsInterface,
    AlkaInterface,
    OAuth2Interface,
    ConfigInterface,
};
