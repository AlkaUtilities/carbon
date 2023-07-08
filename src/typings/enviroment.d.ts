declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            MONGODB_SRV: string;
            ANTICRASH: string;
        }
    }
}

export {};
