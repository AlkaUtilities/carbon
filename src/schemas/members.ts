import { Schema, model } from "mongoose";

// prettier-ignore
export default model(
    "members",
    new Schema({
        GuildID: { type: String, required: true },
        UserID: { type: String, required: true },
        Records: {
            required: true,
            type: {
                Warnings: {
                    required: true,
                    type: [
                        {
                            IssuerID: { type: String, required: true },
                            Reason: { type: String, required: true },
                            Time: { type: Date, required: true },
                        },
                    ],
                },

                Kicks: {
                    required: true,
                    type: [
                        {
                            IssuerID: { type: String, required: true },
                            Reason: { type: String, required: true },
                            Time: { type: Date, required: true },
                        },
                    ],
                },

                Bans: {
                    required: true,
                    type: [
                        {
                            IssuerID: { type: String, required: true },
                            Reason: { type: String, required: true },
                            Time: { type: Date, required: true },
                        },
                    ],
                },

                Timeouts: {
                    required: true,
                    type: [
                        {
                            IssuerID: { type: String, required: true },
                            Reason: { type: String, required: true },
                            Time: { type: Date, required: true },
                            Duration: { type: Number, required: true }
                        },
                    ],
                }
            },
        },
    })
    .index({ GuildID: 1, UserID: 1 }, { unique: true })
);
