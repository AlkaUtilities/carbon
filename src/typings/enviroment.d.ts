declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            MONGODB: string;
            ANTICRASH: string;
            CLIENT_SECRET: string;
            SESSION_SECRET: string;
        }
    }
}

export {};
