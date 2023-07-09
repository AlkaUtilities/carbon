Sets the slowmode for current channel

Usage: /slowmode <set|disable>

Set
	Description: Sets the slowmode for current channel
	Usage: /slowmode set <rate*: [[String]]> <reason: [[String]]> <duration: [[String]]>
	Parameters:
		**rate**: The rate at which the user can send a new message (5s, 1m, 30m, etc.) (required)
		**reason**: Reason for enabling slowmode
		**duration**: Duration for the slowmode (5s, 1m, 30m, etc.), after which it will disable itself.

Disable
	Description: Disables the slowmode for current channel
	Usage: /slowmode disable <reason: [[String]]> <duration: [[String]]>
	Parameters:
		**reason**: Reason for disabling slowmode
		**duration**: Duration for the disabled slowmode (5s, 1m, 30m, etc.), after which it will enable itself.