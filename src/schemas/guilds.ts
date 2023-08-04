import { Schema, model } from "mongoose";

export default model(
    "guilds",
    new Schema({
        GuildID: { type: String, required: true, unique: true },
        Settings: {
            MainRoleID: {
                type: String,
                required: true,
                default: "000000000000000000",
            },
            Modules: {
                UserJoin: {
                    Captcha: {
                        Enabled: {
                            type: Boolean,
                            required: true,
                            default: false,
                        },
                        MaxAttempts: {
                            type: Number,
                            required: true,
                            default: 3,
                        },
                    },

                    Checks: {
                        AccountAge: {
                            Enabled: {
                                type: Boolean,
                                required: true,
                                default: false,
                            },
                            MinimumAccountAge: {
                                type: Number,
                                required: true,
                                default: 7,
                            }, // in days
                            Action: {
                                type: String,
                                required: true,
                                default: "kick",
                            },
                        },
                    },
                },
            },
        },
    })
);
