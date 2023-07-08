# Documentation

## Moderation Tools [[moderation]](commands/moderation/)
A list of moderation tools

### Ban [[ban.ts]](commands/moderation/ban.ts)

**Description:** Bans a user from the server.

**Usage:** `/ban <user*: User> <reason: String>`


### Unban [[unban.ts]](commands/moderation/unban.ts)

**Description:** Unbans a user from the server.

**Usage:** `/unban <user*: User> <reason: String>`

### Kick [[kick.ts]](commands/moderation/kick.ts)

**Description:** Kicks a user from the server.

**Usage:** `/kick <user*: User> <reason: String>`

### Purge [[purge.ts]](commands/moderation/purge.ts)

**Description:** Delete a specific amount of messages from a target/channel

**Usage:** `/purge <all|user|bot>` 
- All: `/purge all <amount*: Number>` [[purge.all.ts]](commands/moderation/purge/purge.all.ts)
- User: `/purge user <amount*: Number> <user*: User>` [[purge.user.ts]](commands/moderation/purge/purge.user.ts)
- Bot: `/purge bot <amount*: Number>` [[purge.bot.ts]](commands/moderation/purge/purge.bot.ts)

### Timeout [[timeout.ts]](commands/moderation/timeout.ts)

**Description:** Restricts a member's ability to communicate.

**Usage:** `/timeout <user*: User> <duration*: Number> <reason: String>`

### Slowmode [[slowmode.ts]](commands/moderation/slowmode.ts)

**Description:** Sets the slowmode for a specific channel

**Usage:** `/slowmode <set|disable>`
- Set: `/slowmode set <rate*: String> <reason: String> <duration: String>` [[slowmode.set.ts]](commands/moderation/slowmode/slowmode.set.ts)
- Disable: `/slowmode disable <reason: String> <duration: String>` [[slowmode.disable.ts]](commands/moderation/slowmode/slowmode.disable.ts)

### Modcheck [[modcheck.ts]](commands/moderation/modcheck.ts)

**Description:** Check if a member is bannable, kickable, moderatable, and managable

**Usage:** `/modcheck <member: User> <ephemeral: Boolean>`

## Miscellaneous [[misc]](commands/misc/)
A list of miscellaneous stuff

### Pfp

**Description:** User to steal profile picture (thanks to [kyhri](https://github.com/kyhrii) for the idea)

**Usage:** `/pfp <user: User>`

## Developer [[developer]](commands/developer/)

### Ping [[ping.ts]](commands/developer/ping.ts)

**Description:** Check the bot's latency

**Usage:** `/ping`

### Reload [[reload]](commands/developer/reload.ts)

**Description:** Reloads commands/events

**Usage:** `/reload <commands|events>`
- Commands: `/reload commands <global: Boolean>`
- Commands: `/reload events`