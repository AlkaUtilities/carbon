import { Schema, model } from "mongoose";

export default model(
    "UserLeveling",
    new Schema({
        UserID: { type: String, required: true, unique: false },
        GuildID: { type: String, required: true, unique: false },
        Level: { type: Number, required: true, default: 1 },
        XP: { type: Number, required: true, default: 0 },
        LastXPInc: { type: Number, required: true, default: 0 },
    })
);
