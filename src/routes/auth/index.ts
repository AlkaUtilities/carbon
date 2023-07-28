import { config as dotenv } from "dotenv";
dotenv({ path: __dirname + "\\..\\.env" });
import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import dashboardLogs from "../../schemas/dashboardLogs";
import { client } from "../../index";

const router = Router();

router.get("/", isUnauthorized, passport.authenticate("discord"));

router.get(
    "/redirect",
    passport.authenticate("discord", {
        successRedirect: "/dashboard",
    })
);

router.get("/logout", (req, res) => {
    if (req.user) {
        const user = req.user;
        req.logout(async (err) => {
            if (err) console.log(err);
            await (
                await dashboardLogs.create({
                    UserID: user.UserID,
                    Operation: "SignOut",
                    Description: `${user.UserID} logged off`,
                })
            ).save();

            res.redirect("/");
        });
    } else {
        res.redirect("/");
    }
});

/**
 * Middleware to check if user is logged out
 */
function isUnauthorized(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
        // If user isn't logged in, continue
        next();
    } else {
        // If user isn logged in, redirect to '/dashboard'
        res.redirect("/dashboard");
    }
}

/**
 * Middleware to check if user is logged in
 */
function isAuthorized(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        // If user is logged in, continue
        next();
    } else {
        // If user isn't logged in, redirect to '/'
        // return res.redirect(401, "/auth");
        return res.status(401).render("error", {
            name: "Unauthorized",
            code: 401,
            description: "You must be logged in to be able access this page.",
        });
    }
}

/**
 * Middleware to check if user is logged in (for API)
 */
function isAuthorizedAPI(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
        // If user is logged in, continue
        next();
    } else {
        // If user isn't logged in, redirect to '/'
        return res.sendStatus(401);
    }
}

/**
 * Middleware to check if user is an admin of set guild.
 * User must be authorized to be able to be checked
 */
function isAdminOfGuild(req: Request, res: Response, next: NextFunction) {
    const guild = client.guilds.cache.get(client.config.mainGuildId);

    if (!guild) {
        return res.status(500).render("error", {
            name: "Internal server error",
            code: 500,
            description: `Main guild not found (trying to access ${req.url}. called from isAdminOfGuild).`,
        });
    }

    const user = guild.members.cache.get(req.user!.UserID);

    if (user && user.permissions.has("ManageGuild")) {
        next();
    } else {
        return res.status(403).render("error", {
            name: "Forbidden",
            code: 403,
            description: "You do not have access to this page.",
        });
    }
}

export {
    router,
    isUnauthorized,
    isAuthorized,
    isAuthorizedAPI,
    isAdminOfGuild,
};
