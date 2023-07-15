- Description: Delete a specific amount of messages from a target/channel

- Usage: `/purge <all|user|bot>`

- All:
	- **Description**: Removes all messages.
	- **Usage**: `/purge all <amount*: Number>`
	- **Parameters**:
		- **amount**:
			- **Type**: [Number](../../Types/Number.md)
			- **Description**: Input amount
			- **Required**: Yes

- User:
	- **Description**: Removes all messages from the user given.
	- **Usage**: `/purge user <amount*: Number> <user*: User>`
	- **Parameters**:
		- **amount**:
			- **Type**: [Number](../../Types/Number.md)
			- **Description**: Input amount
			- **Required**: Yes
		- **user**:
			- **Type**: [User](../../Types/User.md)
			- **Description**: Input user
			- **Required**: Yes

- Bot:
	- **Description**: Removes all messages made by bots.
	- **Usage**: `/purge bot <amount*: Number>`
	- **Parameters**:
		- **amount**:
			- **Type**: [Number](../../Types/Number.md)
			- **Description**: Input amount
			- **Required**: Yes