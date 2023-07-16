### Known Issues

- Timer for anything that uses timer (ex. tempban, slowmode duration) will disappear if the bot restarts in the middle of the timer running
  - **Description**: When a timer is currently running like someone being temp banned, the bot will use `setTimeout()` to unban the user after a specified amount of time. If the bot restarts when the bot is running, the timer will be lost causing the user to never be unbanned
  - **Possible Solutions**:
      1. Store any timer in a database with a date variable of when it should run and the action to execute. Whenever the bot restarts, read all the items in the database and for each item in the database: calculate the remaining time before the timer is triggered and create a `setTimeout()` with the remaining time and action. Discord collection can be used to handle the database. The structure of the item can be written like so
   
  
          In a collection specifically for handling tempbans: 
          ```json
          {
              "UserId" : "id of banned user",
              "GuildId" : "id of guild the user is banned in",
              "Trigger" : "timestamp of when the ban will end"
          }
          ```
