<h1 align="center">
    <img src="./docs/Images/readme-dark.png#gh-light-mode-only" width="400px">
    <img src="./docs/Images/readme-light.png#gh-dark-mode-only" width="400px">
</h1>


<h4 align="center">A Moderation Discord Bot</h4>
<h6 align="center">⚠ This bot is not intended for public use, so you will need to configure it according to your specific needs ⚠<h6>


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