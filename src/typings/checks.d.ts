import { GuildMember, Client } from "discord.js";
import { load_files } from "../../../functions/file_loader";
import GuildSchema, { schema } from "../../../schemas/guilds";
import { HydratedDocumentFromSchema } from "mongoose";

interface CheckFile {
    ignore: true;
    name: string;
    order: number;
    breakOnFail?: boolean | undefined;
    execute: (
        member: GuildMember,
        client: Client,
        guildDocument: HydratedDocumentFromSchema<typeof schema>
    ) => CheckResult;
}

interface CheckResult {
    passed: boolean | null;
    reason: string | undefined;
    break?: boolean | undefined;
}

interface CheckResultNamed extends CheckResult {
    name: string;
}

export { CheckFile, CheckResult, CheckResultNamed };
