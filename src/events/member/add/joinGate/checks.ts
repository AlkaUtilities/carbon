import { GuildMember, Client } from "discord.js";
import { load_files } from "../../../../functions/file_loader";
import GuildSchema from "../../../../schemas/guilds";

import {
    CheckFile,
    CheckResultNamed,
    CheckFlags,
} from "../../../../typings/checks.d";

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

        /* 
        Positive numbers will be sorted ascendingly
        Negative numbers will be sorted descendingly and placed *after* positive numbers
        example: [2, 1, 0, -1, 3, -2, -3] --> [0, 1, 2, 3, -3, -2, -1]
        */
        checks.sort((a, b) => {
            // Compare positive numbers first
            if (a.order >= 0 && b.order >= 0) {
                // If numbers are positive, sort ascendingly
                return a.order - b.order;
            }

            // Compare negative numbers
            if (a.order < 0 && b.order < 0) {
                // If numbers are negative, sort descendingly
                return b.order - a.order;
            }

            // One is positive and one is negative, negative comes after
            return a.order >= 0 ? -1 : 1;
        });

        // console.log(checks);

        async function executeCheck(check: CheckFile) {
            let args: any[] = [];

            if (check.flags?.includes(CheckFlags.ImportCheckResults)) {
                args.push(checkResults);
            }

            return check.execute(member, client, guild, args);
        }

        while (checks.length > 0) {
            const check = checks.shift() as CheckFile;

            const result = await executeCheck(check);

            // Returns if check contains the flag 'NoReturn'
            // which means the check didn't return a result.
            if (check.flags?.includes(CheckFlags.NoReturn)) return;

            checkResults.push({
                name: check.name,
                friendlyName: check.friendlyName,
                passed: result.passed,
                code: result.code,
                reason: result.reason,
                break: result.break,
            });

            // console.log(`finished ${check.order} | ${result.passed}`);

            /* breaking can be done in 2 levels:
            
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
            // If check doesn't return anything, dont put it on the result list
            if (check.flags?.includes(CheckFlags.NoReturn)) continue;

            checkResults.push({
                name: check.name,
                friendlyName: check.friendlyName,
                passed: null,
                code: -1,
                reason: "Check did not execute because of a previous check break.",
                break: undefined,
            });
        }

        // If checks isn't empty, iterate through it and run all checks with
        // the AlwaysRun flag (used for post check script such as checkResult)
        if (checks.length > 0) {
            while (checks.length > 0) {
                const check = checks.shift() as CheckFile;
                if (!check.flags?.includes(CheckFlags.AlwaysRun)) continue;
                await executeCheck(check);
            }
        }
    },
};
