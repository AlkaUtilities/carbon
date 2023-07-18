import DiscordStrategy from "passport-discord";
import passport from "passport";
import config from "../config";
import dashboardUser from "../schemas/dashboardUser";

// no idea what this does but if it works, it works
passport.serializeUser((user: any, done) => {
    // MongoDB object id, not discord user id
    done(null, user.id);
});

// and this
passport.deserializeUser(async (id, done) => {
    const user = await dashboardUser.findById(id);
    if (user) done(null, user);
});

passport.use(
    new DiscordStrategy(
        {
            clientID: config.oauth2.clientId,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: config.oauth2.redirect,
            scope: ["identify"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await dashboardUser.findOne({
                    UserID: profile.id,
                });

                if (user) {
                    done(null, user);
                } else {
                    const newUser = await dashboardUser.create({
                        UserID: profile.id,
                    });

                    const savedUser = await newUser.save();

                    done(null, savedUser);
                }
            } catch (err: any) {
                console.log(err);
                done(err, undefined);
            }
        }
    )
);
