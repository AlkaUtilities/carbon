import { Schema, model } from "mongoose";

// prettier-ignore
export default model(
    "members",
    new Schema({
        GuildID: { type: String, required: true },
        UserID: { type: String, required: true },
        Records: {
            Warnings: {
                type: [
                    {
                        IssuerID: { type: String, required: true },
                        Reason: { type: String, required: true },
                        Time: { type: Date, required: true },
                    },
                ],
                required: true,
            },

            Kicks: {
                type: [
                    {
                        IssuerID: { type: String, required: true },
                        Reason: { type: String, required: true },
                        Time: { type: Date, required: true },
                    },
                ],
                required: true,
            },

            Bans: {
                type: [
                    {
                        IssuerID: { type: String, required: true },
                        Reason: { type: String, required: true },
                        Time: { type: Date, required: true },
                    },
                ],
                required: true,
            }
            
        },
    })
    .index({ GuildID: 1, UserID: 1 }, { unique: true })
);
