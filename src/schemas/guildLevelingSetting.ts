import { Schema, model } from "mongoose";

export default model(
    "GuildLevelingSetting",
    new Schema({
        GuildID: { type: String, required: true, unique: true },
        Enabled: { type: Boolean, required: true, default: false },
        XPMultiplier: { type: Number, required: true, default: 1 },
        XPIncrementInterval: {
            type: Number,
            required: true,
            default: 60,
        }, // Delay between xp increase (in seconds)
        LevelupAnnouncementChannel: { type: Number, required: false },
    })
);
