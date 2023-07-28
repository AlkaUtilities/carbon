import { Router } from "express";
import { client } from "../../index";
import { isAuthorized, isAuthorizedAPI } from "../auth";
import dashboardUser from "../../schemas/dashboardUser";
import moment from "moment-timezone";

const router = Router();

router.get("/", async (req, res) => {
    const userAvatarURL = client.users.cache
        .get(req.user!.UserID)
        ?.displayAvatarURL({ extension: "webp" });

    const data = await dashboardUser.findOne({
        UserID: req.user!.UserID,
    });

    const timezones = moment.tz.names();
    let offsetTmz = [];

    for (let i of timezones) {
        offsetTmz.push({
            name: i,
            offset: moment.tz(i).utcOffset(),
            label: `(UTC${moment.tz(i).utcOffset() >= 0 ? "+" : ""}${
                moment.tz(i).utcOffset() / 60
            }) ${i}`, // i can just change this if i want to modify the label in the future
        });
    }

    offsetTmz = offsetTmz.sort((a, b) => a.offset - b.offset);

    res.status(200).render("dashboard/user", {
        currentPage: req.baseUrl + req.url,
        userAvatarURL: userAvatarURL,
        data: data,
        timezones: offsetTmz,
        util: await import("util"),
    });
});

router.put("/", async (req, res) => {
    try {
        // Create a copy of req.user
        let data: any = req.user;

        // Re-set the preferences to the one from req.body
        for (const [key, value] of Object.entries(req.body["Preferences"])) {
            data.Preferences[key] = value;
        }

        // Validates the data
        const validation = new dashboardUser(data);

        validation
            .validate()
            .then(() => {
                dashboardUser
                    .findOneAndUpdate(
                        { UserID: req.user!.UserID },
                        {
                            $set: data,
                        }
                    )
                    .then((i) => {
                        res.sendStatus(200);
                    })
                    .catch((err) => {
                        res.status(500).send({ error: err });
                    });
            })
            .catch((err) => {
                res.status(500).send({ error: err });
            });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err });
    }
});

export { router };
