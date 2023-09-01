import { Schema, model } from "mongoose";

// prettier-ignore
export const schema = new Schema({
    GuildID: { type: String, required: true, unique: true },
    Settings: {
        // Role given to user when user passed verification, etc.
        MainRoleID: { type: String, required: true, default: "000000000000000000" },
        Modules: {
            JoinGate: {
                Captcha: {
                    Enabled: { type: Boolean, required: true, default: false },
                    MaxAttempts: { type: Number, required: true, default: 3 },
                },
                AccountAge: {
                    Enabled: { type: Boolean, required: true, default: false },
                    MinimumAccountAge: { type: Number, required: true, default: 7 }, // in days
                    Action: { type: String, required: true, default: "nothing" },
                },
                CheckResult: {
                    Enabled: { type: Boolean, required: true, default: false },
                    ChannelID: { type: String, required: true, default: "000000000000000000" }
                },
                LogUser: {
                    Enabled: { type: Boolean, required: true, default: false },
                    ChannelID: { type: String, required: true, default: "000000000000000000" }
                }
            },
        },
    },
})

export default model("guilds", schema);
