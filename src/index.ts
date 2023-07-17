import { config as dotenv } from "dotenv";
dotenv({ path: __dirname + "\\..\\.env" });
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { connect, connection } from "mongoose";
import chalk from "chalk";
import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import { load_events } from "./handlers/event_handler";
import anticrash from "./handlers/anticrash";
import config from "./config";
import { router as authRouter } from "./routes/auth";
import { router as dashboardRouter } from "./routes/dashboard";
import "./strategies/discordStrategy";

const { Guilds, GuildMembers, GuildMessages, GuildPresences, DirectMessages } =
    GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
    intents: [
        Guilds,
        GuildMembers,
        GuildMessages,
        GuildPresences,
        DirectMessages,
    ],
    partials: [User, Message, GuildMember, ThreadMember],
});

const app = express();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 60000 * 60 * 24,
        },
        saveUninitialized: false,
        name: "discord.oauth2",
        resave: true,
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware Routes
app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);

// Routes
app.get("/", isAuthorized, (req, res) => {
    res.status(200).render("home");
});

/**
 * Middleware to check if user is logged in
 */
function isAuthorized(
    req: express.Request,
    res: express.Response,
    next: CallableFunction
) {
    if (req.user) {
        // If user is logged in, go to dashboard
        res.redirect("/dashboard");
    } else {
        // If user isn't logged in, continue
        next();
    }
}

app.get("/ping", (req, res) => {
    res.sendStatus(200);
});

if (process.env.ANTICRASH) anticrash(client, process.env.ANTICRASH);

// Configs (objects)
client.config = config;
client.icon = config.icons;

// Collections (Discord.Collection)
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

load_events(client);

client.login(process.env.TOKEN);

console.log(chalk.green("[MONGOOSE] Connecting to database..."));
connect(process.env.MONGODB)
    .then(() => {
        console.log(chalk.green("[MONGOOSE] Connected to database."));
    })
    .catch((err) => console.log(err));

app.listen(config.expressPort, () => {
    console.log(
        chalk.green(
            "[EXPRESS] Listening on port " + chalk.yellow(config.expressPort)
        )
    );
});

process.on("SIGINT", () => {
    process.exit();
});
