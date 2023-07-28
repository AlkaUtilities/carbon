import { Router } from "express";
import { client } from "../../index";
import { router as userRoute } from "./user";
import { router as logsRoute } from "./logs";
import { router as envRoute } from "./enviroment";
import { isAuthorized, isAdminOfGuild } from "../auth";

const router = Router();

router.use(isAuthorized); // check if user is authorized
router.use(isAdminOfGuild); // check if user is admin

router.get("/", (req, res) => {
    const userAvatarURL = client.users.cache
        .get(req.user!.UserID)
        ?.displayAvatarURL({ extension: "webp" });
    res.status(200).render("dashboard", {
        currentPage: req.baseUrl + req.url,
        userAvatarURL: userAvatarURL,
    });
});

router
    .use("/logs", logsRoute)
    .use("/user", userRoute)
    .use("/enviroment", envRoute);

export { router };
