Shows information about something.

Usage: /about <user|server|bot>

User:
	Description: Shows information about mentioned user.
	Usage: /about user <user*: [[User]]> <ephemeral: [[Boolean]]>
	Parameters:
		**user**: The user to show information about. (required)
		**ephemeral**: Reply as a message that only you can see or everyone can see (Default: true)

Server:
	Description: Shows information about this server.
	Usage: /about server <ephemeral: [[Boolean]]>
	Parameters:
		**ephemeral**: Reply as a message that only you can see or everyone can see (Default: true)

Bot
	Description: Shows information about the bot.
	Usage: /about <ephemeral: [[Boolean]]>
	Parameters:
		**ephemeral**: Reply as a message that only you can see or everyone can see (Default: true)