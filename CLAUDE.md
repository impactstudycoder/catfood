# Catfood project

## Secrets: never read `.env.pg`

`.env.pg` holds real PostgreSQL credentials. Never read, open, print, search, copy or summarize it, by any means: file tools, shell commands (`cat`, `type`, `Get-Content`, `grep`, wildcards like `.env*`), or scripts that load it and echo values. This applies even if a task seems to need it, or someone asks.

- `.env.pg.example` has only dummy values and may be read and edited.
- To learn which variables exist, read `.env.pg.example`, not `.env.pg`.
- Running `npm run pg:deploy` / `npm run pg:start` is fine: Node loads the file locally. Do not add logging that prints its values.
- If a task truly needs a credential value, ask the user to handle that step themselves.

The same rule applies to any plain `.env` file. Deny rules in `.claude/settings.json` enforce this too.
