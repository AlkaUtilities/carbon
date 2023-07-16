### Commands

#### Moderation
- [x] [Kick](Commands/Moderation/Kick.md)
- [x] [Ban](Commands/Moderation/Ban.md)
- [x] [Unban](Commands/Moderation/Unban.md)
- [ ] Tempban
- [x] [Timeout](Commands/Moderation/Timeout.md)
- [x] [Slowmode](Commands/Moderation/Slowmode.md)
- [x] [Purge](Commands/Moderation/Purge.md)
- [x] [Modcheck](Commands/Moderation/Modcheck.md)

#### Miscellaneous
- [x] [About](Commands/Miscellaneous/About.md)
- [x] [Pfp](Commands/Miscellaneous/Pfp.md)

#### Developer
- [x] [Ping](Commands/Developer/Ping.md)
- [x] [Blacklist](Commands/Developer/Blacklist.md)
- [x] [Reload](Commands/Developer/Reload.md)

### Known Issues

- Timer for anything that uses timer (ex. tempban, slowmode duration) will disappear if the bot restarts in the middle of the timer running
  - **Description**: When a timer is currently running like someone being temp banned, the bot will use `setTimeout()` to unban the user after a specified amount of time. If the bot restarts when the bot is running, the timer will be lost causing the user to never be unbanned
  - **Possible Solutions**:
      1. Store any timer in a database with a date variable of when it should run and the action to execute. Whenever the bot restarts, read all the items in the database and for each item in the database: calculate the remaining time before the timer is triggered and create a `setTimeout()` with the remaining time and action. Discord collection can be used to handle the database.
