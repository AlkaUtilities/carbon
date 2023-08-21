import { GuildMember, Client } from "discord.js";
import { load_files } from "../../../functions/file_loader";
import GuildSchema from "../../../schemas/guilds";

import { CheckFile, CheckResultNamed } from "../../../typings/checks";

module.exports = {
    name: "guildMemberAdd",
    once: false,
    friendlyName: "JoinGateChecks",
    async execute(member: GuildMember, client: Client) {
        const guild = await GuildSchema.findOne({ GuildID: member.guild.id });

        if (!guild) return;

        const files = await load_files("modules/joingate/checks");

        let checks: CheckFile[] = [];

        let checkResults: CheckResultNamed[] = [];

        for (const file of files) {
            // console.log(file);
            checks.push(require(file));
        }

        checks.sort((a, b) => a.order - b.order);

        // console.log(checks);

        while (checks.length > 0) {
            const check = checks.shift() as CheckFile;

            // console.log(`running  ${check.order}`);

            const result = await check.execute(member, client, guild);

            checkResults.push({
                name: check.name,
                passed: result.passed,
                reason: result.reason,
                break: result.break,
            });

            // console.log(`finished ${check.order} | ${result.passed}`);

            /* 
            breaking can be done in 2 levels:
            
            1. the file (defined as breakOnFail)
            this is defined in the file's module.exports
            if this is set to true, the loop will break
            anytime that file returns with $passed = false

            2. returns (defined as break):
            this can be defined in any return statement in
            the file. when set to true, the loop will break
            regardless of passing or not. this is useful for 
            where breaking is dynamic or where there can be 
            multiple different actions that can be taken when 
            something happens in the test that may require the 
            test to break. this value can be undefined. 
            if false or undefined, the code will *still*
            check if no. 1 (breakOnFail) is true
            look at memberAccountAge for an example
            */

            // if test returns with break = true, break.
            if (result.break === true) break;

            // if test failed and breakOnFail is true, break.
            if (result.passed === false && check.breakOnFail === true) break;
        }

        // Executes for each un-executed checks.
        // Checks that didn't get a chance to execute
        // due to a previous check that breaks
        for (const check of checks) {
            checkResults.push({
                name: check.name,
                passed: null,
                reason: "Check did not execute because of a previous check breaking.",
                break: undefined,
            });
        }

        // console.log(checkResults);
    },
};
