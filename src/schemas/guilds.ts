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
                    required: true
                },
                AccountAge: {
                    Enabled: { type: Boolean, required: true, default: false },
                    MinimumAccountAge: { type: Number, required: true, default: 7 }, // in days
                    Action: { type: String, required: true, default: "nothing" },
                    required: true
                },
                CheckResult: {
                    Enabled: { type: Boolean, required: true, default: false },
                    ChannelID: { type: String, required: true, default: "000000000000000000" },
                    required: true
                },
                LogUser: {
                    Enabled: { type: Boolean, required: true, default: false },
                    ChannelID: { type: String, required: true, default: "000000000000000000" },
                    required: true
                },
                required: true,
            },
            required: true,
        },
        required: true,
    },
})

export default model("guilds", schema);
