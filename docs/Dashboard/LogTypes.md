### Log schema
```js
{
    UserID    : { type: String, required: true }, // ID of logged user
    Time      : { type: Date,   required: true }, // Time of logging
    Operation : { type: String, required: true }, // Type of logged operation (`SignIn`, `SignOut`, etc.)
}
```

### Operation types
- **Authorization**
  - `SignIn` - Triggered when a user logs in
  - `SignOut` - Triggered when a user logs out