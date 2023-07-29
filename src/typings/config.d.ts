interface ConfigInterface {
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
    icons: IconsInterface;
    alka: {
        bots: string[];
    };
    oauth2: {
        clientId: string;
        redirect: string;
    };
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

export { ConfigInterface, IconsInterface };
