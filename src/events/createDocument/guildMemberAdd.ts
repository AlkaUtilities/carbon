import { GuildMember, Client, Events } from "discord.js";
import MemberSchema from "../../schemas/members";

/** When a user joins a guild, create a GuildSchema for said user */
module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    friendlyName: "NewMemberDatabaseEntry",
    async execute(member: GuildMember, client: Client) {
        let memberDocument = await MemberSchema.findOne({
            UserID: member.user.id,
            GuildID: member.guild.id,
        });

        if (memberDocument) return;

        memberDocument = await MemberSchema.create({
            UserID: member.user.id,
            GuildID: member.guild.id,
        });
        await memberDocument.save();
    },
};
