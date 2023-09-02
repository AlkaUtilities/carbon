import { GuildMember, Client } from "discord.js";
import GuildSchema, { schema } from "../../../schemas/guilds";
import { HydratedDocumentFromSchema } from "mongoose";

enum CheckFlags {
    /**Indicates that the test will not return a value */
    NoReturn = "noReturn",

    /**Request check results */
    ImportCheckResults = "importCheckResults",

    /** Indicates that the test should always run, regardless of breaks or not */
    AlwaysRun = "alwaysRun",
}

interface CheckFile {
    /**Check file name */
    name: string;
    /**Check name that will be showed on the embed */
    friendlyName: string;
    /**Order of execution */
    order: number;
    /**`true` - If the current check failed, the check will stop running and tests after the current one will be marked as null
     *
     * `false` - If the check failed, the check will continue
     *
     * `undefined` - It will default as `false`
     */
    breakOnFail?: boolean | undefined;
    /**External import request
     *
     * For example: 'NoReturn' will indicate that the check will not return anything
     */
    flags?: CheckFlags[] | undefined;
    execute: CheckFunction;
}

interface CheckFunction {
    (
        member: GuildMember,
        client: Client,
        // guildDocument: HydratedDocumentFromSchema<typeof schema>,
        guildDocument: any,
        args?: any[]
    ): CheckResult;
}

interface CheckResult {
    /**`true` - The user passed
     *
     * `false` - The user failed
     *
     * `null` - Unknown, this could be used for when the module is disabled or failed to execute
     */
    passed: boolean | null;
    /**
     * `-1` - Module is disabled
     *
     * `0` - Test passed
     *
     * `1` - Test failed
     */
    code: number;
    /**Reason for the user passing or failing the test */
    reason: string | undefined;
    /**`true` - Test will stop running regardless of passing status and tests after the current one will be marked as null
     *
     * `false` - The test will continue
     *
     * `undefined` - It will default as `false`
     */
    break?: boolean | undefined;
}

interface CheckResultNamed extends CheckResult {
    /**Check name */
    name: string;
    /**Check name that will be showed on the embed */
    friendlyName: string;
}

export { CheckFile, CheckFunction, CheckResult, CheckResultNamed, CheckFlags };
