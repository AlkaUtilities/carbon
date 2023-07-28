import { Router } from "express";
import { client } from "../../index";
import moment from "moment-timezone";
import dashboardLogs from "../../schemas/dashboardLogs";
import dashboardUser from "../../schemas/dashboardUser";

const router = Router();

router.get("/", async (req, res) => {
    const logs = await dashboardLogs.find({});
    const user = await dashboardUser.findOne({ UserID: req.user!.UserID });

    let logsFormatted: Array<
        | {
              avatarURL: string;
              title: string;
              date: string;
              id: string;
              raw: {
                  UserID: string;
                  Time: Date;
                  Operation: string;
                  Description: string;
              };
          }
        | undefined
    > = [];

    logs.forEach((l) => {
        // Using the bot, fetch the user object by id
        const discordUser = client.users.cache.get(l.UserID);
        logsFormatted.push({
            avatarURL: discordUser
                ? discordUser.displayAvatarURL({ extension: "webp" }) // use the user object to get the avatar
                : "https://cdn.discordapp.com/embed/avatars/0.png",
            title: `${
                discordUser?.username ? discordUser.username : l.UserID
            } ${
                // use the user object to get the username
                l.Operation
            }`,
            date: moment
                .utc(l.Time)
                .tz(user!.Preferences!.Timezone)
                .format("DD/MM/YYYY HH:mm:ss"),
            id: l.id,
            raw: l,
        });
    });

    logsFormatted.sort((a, b) => b!.raw.Time.getTime() - a!.raw.Time.getTime());

    const userAvatarURL = client.users.cache
        .get(req.user!.UserID)
        ?.displayAvatarURL({ extension: "webp" });

    res.status(200).render("dashboard/logs", {
        currentPage: req.baseUrl + req.url,
        logs: logsFormatted,
        userAvatarURL: userAvatarURL,
    });
});
export { router };
