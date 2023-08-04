import { Schema, model } from "mongoose";

export default model(
    "members",
    new Schema({
        GuildID: { type: String, required: true },
        UserID: { type: String, required: true },
    })
);
