require("dotenv").config({ path: __dirname + "\\..\\..\\.env" });
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

export { router };
