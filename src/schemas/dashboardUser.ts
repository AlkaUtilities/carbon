import { Schema, model } from "mongoose";

export default model(
    "dashboardUsers",
    new Schema({
        UserID: { type: String, required: true },
        Preferences: {
            required: true,
            type: {
                Timezone: { type: String, required: true },
                ShowDebugInfo: { type: Boolean, required: true },
            },
        },
        Role: { type: String, required: true },
    })
);
