// import { ObjectId } from "mongoose";

declare namespace Express {
    interface User {
        // _id: import("mongoose").ObjectId;
        UserID: string;
        Role: string;
        Preferences: {
            Timezone: string;
            ShowDebugInfo: false;
        };
    }

    interface Request {
        io: import("socket.io").Server;
    }
}
