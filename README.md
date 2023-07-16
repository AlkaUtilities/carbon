<div align="center">

<h1>Carbon</h1>
<h4>A moderation Discord bot</h4>
<h6>This bot is not intended for public use, so you will need to configure it according to your specific needs.<h6>

</div>

## About
Carbon is a Discord bot for the Alka Hangout [Discord server](https://discord.com/invite/9h8QHAj2a5). The bot is currently in development and not actively in use on the server yet.

## Setup

<details open>
<summary>
Using Replit
</summary>

1. Import the repository to replit
2. Configure the secrets:
   - `TOKEN` : Discord token
   - `MONGODB` : MongoDB SRV connection string
   - `ANTICRASH` : Webhook URL to handle crashes
3. Configure the bot to your needs by by going to [Configuration](#configuration)
4. Click **Run**

</details>

<details open>
<summary>
Using Docker
</summary>

Coming soon...

</details>

## Configuration

All configuration are stored in the [config file](src/config.ts)

- `cli` : Strings used in logs
  - `status_ok` : String to represent that something succeded 
  - `status_bad`  String to represent that something failed
- `log` : Undocumented
  - `enabled` : Undocumented
  - `filePath` : Undocumented
- `ownerId` : The user id of the bot owner (used to give access to blacklist commands)
- `developersId` : The user ids of the bot developer (used to give access to blacklist commands)
- `devGuildId` : Guild to set commands marked as type `DEV` to
- `icons` : Custom emojis used in messages/embeds
  - `loading` : Undocumented
  - `sync` : Used to represent the database status connecting and disconnecting
  - `bot` : Undocumented
    - `developer` : Used as prefix for the username in [`/about user`](src/commands/misc/about/about.user.ts) if the user's id is included in `developersId`
  - `server` : 
    - `owner` : Used as prefix for the username in [`/about user`](src/commands/misc/about/about.user.ts) if the user is the owner of the guild
    - `verified` : Used as prefix for the server name in [`/about server`](src/commands/misc/about/about.server.ts) if the server is verified
    - `partnered` : Used as prefix for the server name in [`/about server`](src/commands/misc/about/about.server.ts) if the server is partnered
  - `alka` : Undocumented
    - `bot` Used as prefix for the username in in [`/about user`](src/commands/misc/about/about.user.ts) if the user is a custom bot made for Alka Hangout
  - `blacklist` : Emoji used to display the status of a user's blacklist
    - `found` : Emoji to show if the user is found in blacklist
    - `notfound` : Emoji to show if the user is not found in blacklist
- `alka` : Undocumented
  - `bots` : The user ids of bots custom made for Alka Hangout (`icons -> alka -> bot` will be displayed as a prefix)
- `userLeveling` : Default settings for leveling
  - `min` : Minimum amount of XP
  - `max` : Maximum amount of XP
  - `required` : XP required to levlup 



## Commands Documentation
Go to [docs](docs/Commands/)

## Known Issues

- Timer for anything that uses timer (ex. tempban, slowmode duration) will disappear if the bot restarts in the middle of the timer running
  - **Description**: When a timer is currently running like someone being temp banned, the bot will use `setTimeout()` to unban the user after a specified amount of time. If the bot restarts when the bot is running, the timer will be lost causing the user to never be unbanned
  - **Possible Solutions**:
      1. Store any timer in a database with a date variable of when it should run and the action to execute. Whenever the bot restarts, read all the items in the database and for each item in the database: calculate the remaining time before the timer is triggered and create a `setTimeout()` with the remaining time and action. Discord collection can be used to handle the database. The structure of the item can be written like so <br />
         In a collection specifically for handling tempbans: 
         ```json
         {
             "UserId" : "id of banned user",
             "GuildId" : "id of guild the user is banned in",
             "Trigger" : "timestamp of when the ban will end"
         }
         ```
