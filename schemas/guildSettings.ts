import { Schema, model } from "mongoose";

export default model(
    "GuildSettings",
    new Schema({
        GuildID: { type: String, required: true, unique: true },
        LevelingXPMultiplier: { type: Number, required: true, default: 1 },
    })
);
