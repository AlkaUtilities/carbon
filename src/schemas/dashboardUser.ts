import { Schema, model } from "mongoose";

export default model(
    "User",
    new Schema({
        UserID: { type: String, required: true },
    })
);
