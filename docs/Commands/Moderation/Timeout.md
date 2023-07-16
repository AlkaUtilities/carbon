- Description: Restricts a member's ability to communicate.

- Usage: `/timeout <user*: User> <duration*: Number> <reason: String>`

- Parameters:
	- **user**:
		- **Type**: [User](../../Types/User.md)
		- **Description**: User to timeout
		- **Required**: Yes
	- **duration**:
		- **Type**: [String](../../Types/String.md)
		- **Description**: Duration of the timeout (5s, 1m, 30m, etc.)
		- **Required**: Yes
	- **reason**:
		- **Type**: [String](../../Types/String.md)
		- **Description**: Reason for timeout-ing the user
		- **Required**: No