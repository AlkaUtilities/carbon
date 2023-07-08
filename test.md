# Command test on JS

## Status
- ( OK  )   blacklist.add
- ( OK  )   blacklist.remove
- ( OK  )   ping
- ( OK  )   reload
- ( ERR )   about.bot
- ( OK  )   about.server
- ( OK  )   about.user
- ( OK  )   pfp
- ( BUG )   ban
- ( BUG )   kick
- ( OK  )   modcheck
- ( OK  ) purge.all
- ( BUG ) purge.bot
- ( BUG ) purge.user
- ( OK  ) slowmode.disable
- ( OK  ) slowmode.set
- ( OK  ) timeout
- ( OK  ) unban


## Bugs

#### Discriminator becomes '0' if user has pomelo username
Fix: Hide discriminator if discriminator is '0'

#### Unable to send reason message to banned/kick user DM
Fix: None


## Suggestion

#### Add `duration` to slowmode.set
Like the one in slowmode.disable


## Warns

#### Timeout for `duration` in slowmode.disable will stop if bot restarts in the middle of the timeout