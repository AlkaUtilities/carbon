import { GuildMember, Client, AttachmentBuilder, EmbedBuilder } from "discord.js";
import GuildSchema from "../../../schemas/guilds";
import { CaptchaGenerator } from "captcha-canvas";
import { checkMemberAccountAge, captcha } from "./checks";

module.exports = {
    name: "guildMemberAdd",
    once: false,
    friendlyName: "MemberAddCaptcha",
    async execute(member: GuildMember, client: Client) {
        const guildDocument = await GuildSchema.findOne({
            GuildID: member.guild.id,
        });

        // check if user passes account age check
        if (!(await checkMemberAccountAge(member, guildDocument))) return;

        // ask user to solve captcha
        captcha(member, client, guildDocument);
    },
};
