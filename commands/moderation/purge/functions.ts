import {
    Collection,
    Snowflake,
    Message,
    ChatInputCommandInteraction,
} from "discord.js";
async function results(
    deletedMessages: Collection<Snowflake, Message>,
    interaction: ChatInputCommandInteraction
) {
    const results: any = {};
    for (const [_, deleted] of deletedMessages) {
        const user = deleted.author.tag;
        if (!results[user]) results[user] = 0;
        results[user]++;
    }

    const userMessageMap = Object.entries(results);

    const finalResult =
        `${deletedMessages.size} message${
            deletedMessages.size > 1 ? "s" : ""
        } were removed.\n\n` +
        `${userMessageMap
            .map(([user, messages]) => {
                `${user} : ${messages}`;
            })
            .join("\n")}`;

    const msg = await interaction.reply({
        content: finalResult,
        fetchReply: true,
    });

    setTimeout(() => msg.delete(), 3000); // auto delete message after 3000 miliseconds
}

const ignore = true;
export { results, ignore };
