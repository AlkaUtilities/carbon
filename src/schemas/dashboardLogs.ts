import { Schema, model } from "mongoose";

export default model(
    "dashboardLogs",
    new Schema({
        UserID: { type: String, required: true },
        Time: { type: Date, required: true, default: Date.now },
        Operation: { type: String, required: true },
        Description: { type: String, required: true },
    })
);
