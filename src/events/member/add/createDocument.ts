import { GuildMember, Client } from "discord.js";
import MemberSchema from "../../../schemas/members";

/** When a user joins a guild, create a GuildSchema for said user */
module.exports = {
    name: "guildMemberAdd",
    once: false,
    friendlyName: "GuildMemberAddCreateDatabaseEntry",
    async execute(member: GuildMember, client: Client) {
        const memberDocument = await MemberSchema.create({
            UserID: member.user.id,
            GuildID: member.guild.id,
        });

        await memberDocument.save();
    },
};
