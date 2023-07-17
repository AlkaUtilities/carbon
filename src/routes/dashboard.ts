import { Router, Request, Response } from "express";

const router = Router();

router.get("/", isAuthorized, (req, res) => {
    res.send(200);
});

/**
 * Middleware to check if user is logged in
 */
function isAuthorized(req: Request, res: Response, next: CallableFunction) {
    if (req.user) {
        // If user is logged in, continue
        next();
    } else {
        // If user isn't logged in, redirect to '/'
        res.redirect("/");
    }
}

export { router };
