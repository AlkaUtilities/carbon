declare global {
    namespace NodeJS {
        interface ProcessEnv {
            /** Discord bot token*/
            TOKEN: string;
            /** MongoDB connection string */
            MONGODB: string;
            /** Discord webhook to show crashes */
            ANTICRASH: string;
            /** Client secret */
            CLIENT_SECRET: string;
            /** Secret used for express-session */
            SESSION_SECRET: string;
            /** Website port (express) */
            EXPRESS_PORT: string;
            /** Websocket port (socket.io) */
            SOCKETIO_PORT: string;
        }
    }
}

export {};
