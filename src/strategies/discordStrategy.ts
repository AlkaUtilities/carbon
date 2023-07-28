import DiscordStrategy from "passport-discord";
import passport from "passport";
import dashboardUser from "../schemas/dashboardUser";
import dashboardLogs from "../schemas/dashboardLogs";
import { client } from "../index";

// no idea what this does but if it works, it works
passport.serializeUser((user: any, done) => {
    // MongoDB object id, not discord user id
    done(null, user.id);
});

// and this
passport.deserializeUser(async (id, done) => {
    const user = await dashboardUser.findById(id);
    if (user) done(null, user as Express.User);
});

passport.use(
    new DiscordStrategy(
        {
            clientID: client.config.oauth2.clientId,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: client.config.oauth2.redirect,
            scope: ["identify"],
        },
        async (accessToken, refreshToken, profile, done) => {
            const guild = client.guilds.cache.get(client.config.mainGuildId);

            if (!guild) {
                done(
                    new Error(
                        "Main guild not found (trying to access ${req.url}. called from isAdminOfGuild)."
                    ),
                    undefined
                );
            }

            const member = guild!.members.cache.get(profile.id);

            if (!member) {
                await (
                    await dashboardLogs.create({
                        UserID: profile.id,
                        Operation: "RejectedSignIn",
                        Description: `User was rejected because user is not in guild`,
                    })
                ).save();
                done(
                    // FIXME Show the user the error message but not the trace
                    // for example:
                    // Error: You do not have access to this page.
                    // at E:\VSCode\discord-bot\src\strategies\discordStrategy.ts:51:21
                    // at Generator.next (<anonymous>)
                    // at fulfilled (E:\VSCode\discord-bot\src\strategies\discordStrategy.ts:5:58)
                    // at processTicksAndRejections (node:internal/process/task_queues:96:5)
                    // new Error("You do not have access to this page."),
                    undefined, // we just return undefined for now, the user will get a 401 Unauthorized response
                    undefined
                );
                return;
            }

            // if (!user.permissions.has("ManageGuild")) {
            //     await (
            //         await dashboardLogs.create({
            //             UserID: profile.id,
            //             Operation: "RejectedSignIn",
            //             Description: `${profile.id} was rejected because user does not have the required permission`,
            //         })
            //     ).save();
            //     done(
            //         new Error(
            //             "You do not have the required permissions to this page."
            //         ),
            //         undefined
            //     );
            //     return;
            // }

            try {
                const user = await dashboardUser.findOne({
                    UserID: profile.id,
                });

                if (user) {
                    await (
                        await dashboardLogs.create({
                            UserID: profile.id,
                            Operation: "SignIn",
                            Description: `User signed in`,
                        })
                    ).save();
                    done(null, user as Express.User);
                } else {
                    await (
                        await dashboardLogs.create({
                            UserID: profile.id,
                            Operation: "FirstSignIn",
                            Description: `User signed in for the first time`,
                        })
                    ).save();

                    // Default role is user
                    let role = "user";

                    // If the member has admin perms, set the role to admin
                    if (member.permissions.has("Administrator")) role = "admin";

                    // If the user id is in the developersId array, set the role to developer
                    if (client.config.developersId.includes(profile.id))
                        role = "developer";

                    //* New user default values
                    const newUser = await dashboardUser.create({
                        UserID: profile.id,
                        Preferences: {
                            Timezone: "Etc/UTC",
                            ShowDebugInfo: false,
                        },
                        Role: role,
                    });

                    const savedUser = await newUser.save();

                    done(null, savedUser as Express.User);
                }
            } catch (err: any) {
                console.log(err);
                done(err, undefined);
            }
        }
    )
);
