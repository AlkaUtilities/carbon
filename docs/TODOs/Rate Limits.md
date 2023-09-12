# Rate Limits

Rate limit for staff actions such as creating channels, creating roles, kicking/banning a member, etc. The rate limit should be able to be modified for each actions.

If a staff performs an action more than the specified amount of rate limit count in under the specific rate limit window, log the staff member and revoke all staff roles.

### Database Structure

<!-- prettier-ignore -->
```json
{
    "RateLimits": {

        // Config used if the action specific config is unset
        "Global": {
            "Limit": 10,
            "Window": 60
        },

        "Channel": {
            "Limit": 5,
            "Window": 60
        },
        
    }
}
```
