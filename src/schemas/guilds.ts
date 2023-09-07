import { Schema, model } from "mongoose";

// prettier-ignore
export const schema = new Schema({
    GuildID: { type: String, required: true, unique: true },
    Settings: {
        required: true,
        type: {
            // Role given to user when user passed verification, etc.
            MainRoleID: { type: String, required: true },
            Modules: {
                required: true,
                type: {
                    JoinGate: {
                        required: true,
                        type: {
                            Captcha: {
                                Enabled: { type: Boolean, required: true },
                                MaxAttempts: { type: Number, required: true, default: 3 },
                            },
                            AccountAge: {
                                Enabled: { type: Boolean, required: true },
                                MinimumAccountAge: { type: Number, required: true }, // in days
                                Action: { type: String, required: true, default: "nothing" },
                            },
                            CheckResult: {
                                Enabled: { type: Boolean, required: true },
                                ChannelID: { type: String, required: true }
                            },
                            LogUser: {
                                Enabled: { type: Boolean, required: true },
                                ChannelID: { type: String, required: true }
                            }
                        }
                    }
                },
            },
            RateLimits: {
                required: true,
                type: {
                    Global: {
                        required: true,
                        type: {
                            Limit: { type: Number, required: true },
                            Window: { type: Number, required: true },
                        }
                    },

                    Channel: {
                        required: true,
                        type: {
                            Create: {
                                required: true,
                                type: {
                                    Limit: { type: Number, required: true },
                                    Window: { type: Number, required: true }
                                }
                            }
                        }
                    }
                }
            }
        },
        default: {
            MainRoleID: "000000000000000000",
            Modules: {
                JoinGate: {
                    Captcha: {
                        Enabled: false,
                        MaxAttempts: 3
                    },

                    AccountAge:{
                        Enabled: false,
                        MinimumAccountAge: 7,
                        Action: "nothing"
                    },

                    CheckResult: {
                        Enabled: false, 
                        ChannelID: "000000000000000000"
                    },

                    LogUser: {
                        Enabled: false,
                        ChannelID: "000000000000000000"
                    }
                },
            },
            RateLimits: {
                Global: {
                    Limit: 5,
                    Window: 60
                },

                Channel: {
                    Create: {
                        Limit: 5,
                        Window: 60
                    }
                }
            }
        }
    },
})

export default model("guilds", schema);
