import { ChatInputCommandInteraction, Client } from "discord.js";
import UserBlacklist from "../../../schemas/userBlacklist";
import GuildBlacklist from "../../../schemas/guildBlacklist";

module.exports = {
    subCommand: "blacklist.add",
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        const option = interaction.options.getString("options", true);
        let id: any = interaction.options.getString("id", true);
        const reason =
            interaction.options.getString("reason") || "No reason provided.";

        const config = client.config;

        if (Number.isNaN(Number(id)))
            return interaction.followUp({ content: "ID is not a number." });
        if (config.ownerId == id || config.developersId.includes(id))
            return interaction.followUp({
                content: `You cannot blacklist a deveoper.`,
            });

        switch (option) {
            case "user":
                {
                    try {
                        let Data = await UserBlacklist.findOne({ UserID: id });
                        if (Data)
                            return interaction.followUp({
                                content: `User with id ${id} is already blacklisted. Document ID: \`${Data._id}\``,
                            });
                        const time = Date.now();
                        let newData = await UserBlacklist.create({
                            UserID: id,
                            Reason: reason,
                            Time: time,
                        });
                        interaction.followUp({
                            content: `Blacklisted user with id \`${id}\`\nReason: ${reason}\nTime: ${time}\nDocument ID: \`${newData._id}\``,
                        });
                    } catch (err) {
                        return interaction.followUp({
                            content: `There was an error blacklisting user with id \`${id}\``,
                        });
                    }
                }
                break;

            case "guild":
                {
                    try {
                        let Data = await GuildBlacklist.findOne({
                            GuildID: id,
                        });
                        if (Data)
                            return interaction.followUp({
                                content: `Guild with id ${id} is already blacklisted. Document ID: \`${Data._id}\``,
                            });
                        const time = Date.now();
                        let newData = await GuildBlacklist.create({
                            GuildID: id,
                            Reason: reason,
                            Time: time,
                        });
                        interaction.followUp({
                            content: `Blacklisted guild with id \`${id}\`\nReason: ${reason}\nTIme: ${time}\nDocument ID: \`${newData._id}\``,
                        });
                    } catch (err) {
                        return interaction.followUp({
                            content: `There was an error blacklisting guild with id \`${id}\``,
                        });
                    }
                }
                break;
        }
    },
};
