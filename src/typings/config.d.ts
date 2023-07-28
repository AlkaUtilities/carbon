interface Config {
    cli: {
        status_ok: string;
        status_bad: string;
    };
    log: {
        enabled: boolean;
        filePath: string;
    };
    ownerId: string;
    developersId: string[];
    devGuildId: string;
    mainGuildId: string;
    icons: Icons;
    alka: {
        bots: string[];
    };
    userLeveling: {
        min: number;
        max: number;
        required: number;
    };
    oauth2: {
        clientId: string;
        redirect: string;
    };
}

interface Icons {
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
    blacklist: {
        found: string;
        notfound: string;
    };
}

export { Config, Icons };
