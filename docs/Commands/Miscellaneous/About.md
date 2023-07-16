- Description: Shows information about something.

- Usage: `/about <user|server|bot>`

- User:
	- **Description**: Shows information about mentioned user.
	- **Usage**: `/about user <user*: User> <ephemeral: Boolean>`
	- **Parameters**:
		- **user**:
			- **Type**: [User](../../Types/User.md)
			- **Description**: The user to show information about.
			- **Required**: True
		- **ephemeral**:
			- **Type**: [Boolean](../../Types/Boolean.md)
			- **Description** Reply as a message that only you can see or everyone can see (Default: true)
			- **Required**: No

- Server:
	- **Description**: Shows information about this server.
	- **Usage**: `/about server <ephemeral: Boolean>`
	- **Parameters**:
		- **ephemeral**:
			- **Type**: [Boolean](../../Types/Boolean.md)
			- **Description**: Reply as a message that only you can see or everyone can see (Default: true)
			- **Required**: No

- Bot
	- **Description**: Shows information about the bot.
	- **Usage**: `/about <ephemeral: Boolean>`
	- **Parameters**:
		- **ephemeral**:
			- **Type**: [Boolean](../../Types/Boolean.md)
			- **Description**: Reply as a message that only you can see or everyone can see (Default: true)
			- **Required**: No