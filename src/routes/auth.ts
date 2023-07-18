import { config as dotenv } from "dotenv";
dotenv({ path: __dirname + "\\..\\.env" });
import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/", passport.authenticate("discord"));

router.get(
    "/redirect",
    passport.authenticate("discord", {
        failureRedirect: "/forbidden",
        successRedirect: "/dashboard",
    }),
    (req, res) => {
        res.send(req.user);
    }
);

router.get("/logout", (req, res) => {
    if (req.user) {
        req.logout((err) => {
            if (err) console.log(err);
        });
    } else {
        res.redirect("/");
    }
});

export { router };
