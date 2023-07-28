import { config as dotenv } from "dotenv";
dotenv({ path: __dirname + "\\..\\.env" });
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { connect, connection } from "mongoose";
import chalk from "chalk";
import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import MongoStore from "connect-mongo";
import { Server } from "socket.io";
import http from "http";
import Config from "./config";
import discordStrategy from "./strategies/discordStrategy";
import anticrash from "./handlers/anticrash";
import { load_events } from "./handlers/event_handler";
import { router as authRouter, isUnauthorized } from "./routes/auth";
import { router as dashboardRouter } from "./routes/dashboard";

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

// Configs (objects)
const config = Config.load();

client.config = config;
client.icon = config.icons;

discordStrategy(client);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:8080"],
    },
});

io.sockets.setMaxListeners(0);

console.log(chalk.green("[MONGOOSE] Connecting to database..."));
connect(process.env.MONGODB)
    .then(() => {
        console.log(chalk.green("[MONGOOSE] Connected to database."));
    })
    .catch((err) => console.log(err));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 60000 * 60 * 24,
        },
        saveUninitialized: false,
        name: "discord.oauth2",
        resave: false,
        store: MongoStore.create({
            client: connection.getClient(),
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
console.log(
    chalk.green(`[EXPRESS] Using ${path.join(__dirname, "public")} as public`)
);

/** Middleware to pass the socket.io instance to the route handlers */
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
console.log(
    chalk.green(`[EXPRESS] Using ${path.join(__dirname, "views")} as views`)
);

app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);

app.get("/", isUnauthorized, (req, res) => {
    res.status(200).render("home");
});

app.get("/ping", (req, res) => {
    res.sendStatus(200);
});

app.use((req, res, next) => {
    res.status(404).render("error", {
        name: "Not found",
        code: 404,
        description: `The requested URL ${req.url} does not exist.`,
    });
});

if (process.env.ANTICRASH) anticrash(client, process.env.ANTICRASH);

// Collections (Discord.Collection)
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

// load_events(client);

client.login(process.env.TOKEN);

app.listen(parseInt(process.env.EXPRESS_PORT), () => {
    console.log(
        chalk.green(
            "[EXPRESS] Listening on port " +
                chalk.yellow(process.env.EXPRESS_PORT)
        )
    );
});

io.listen(parseInt(process.env.SOCKETIO_PORT));

process.on("SIGINT", () => {
    process.exit();
});

export { client };
