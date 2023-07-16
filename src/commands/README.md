# Documentation

## Moderation Tools [[moderation]](moderation/)
A list of moderation tools

### Ban [[ban.ts]](moderation/ban.ts)

**Description:** Bans a user from the server.

**Usage:** `/ban <user*: User> <reason: String>`


### Unban [[unban.ts]](moderation/unban.ts)

**Description:** Unbans a user from the server.

**Usage:** `/unban <user*: User> <reason: String>`

### Kick [[kick.ts]](moderation/kick.ts)

**Description:** Kicks a user from the server.

**Usage:** `/kick <user*: User> <reason: String>`

### Purge [[purge.ts]](moderation/purge.ts)

**Description:** Delete a specific amount of messages from a target/channel

**Usage:** `/purge <all|user|bot>` 
- All: `/purge all <amount*: Number>` [[purge.all.ts]](moderation/purge/purge.all.ts)
- User: `/purge user <amount*: Number> <user*: User>` [[purge.user.ts]](moderation/purge/purge.user.ts)
- Bot: `/purge bot <amount*: Number>` [[purge.bot.ts]](moderation/purge/purge.bot.ts)

### Timeout [[timeout.ts]](moderation/timeout.ts)

**Description:** Restricts a member's ability to communicate.

**Usage:** `/timeout <user*: User> <duration*: Number> <reason: String>`

### Slowmode [[slowmode.ts]](moderation/slowmode.ts)

**Description:** Sets the slowmode for a specific channel

**Usage:** `/slowmode <set|disable>`
- Set: `/slowmode set <rate*: String> <reason: String> <duration: String>` [[slowmode.set.ts]](moderation/slowmode/slowmode.set.ts)
- Disable: `/slowmode disable <reason: String> <duration: String>` [[slowmode.disable.ts]](moderation/slowmode/slowmode.disable.ts)

### Modcheck [[modcheck.ts]](moderation/modcheck.ts)

**Description:** Check if a member is bannable, kickable, moderatable, and managable

**Usage:** `/modcheck <member: User> <ephemeral: Boolean>`

## Miscellaneous [[misc]](misc/)
A list of miscellaneous stuff

### Pfp

**Description:** User to steal profile picture (thanks to [kyhri](https://github.com/kyhrii) for the idea)

**Usage:** `/pfp <user: User>`

## Developer [[developer]](developer/)

### Ping [[ping.ts]](developer/ping.ts)

**Description:** Check the bot's latency

**Usage:** `/ping`

### Reload [[reload]](developer/reload.ts)

**Description:** Reloads events

**Usage:** `/reload <src/commands|events>`
- src/commands: `/reload src/commands <global: Boolean>`
- src/commands: `/reload events`