import { Schema, model } from "mongoose";

export default model(
    "UserBlacklist",
    new Schema({
        UserID: { type: String, required: true, unique: true },
        Reason: { type: String, required: true, unique: false },
        Time: { type: Number, required: true, unique: false },
    })
);
