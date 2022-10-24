declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            MONGODB_SRV: string;
            ANTICRASH_WEBHOOKURL: string;
        }
    }
}

export { };