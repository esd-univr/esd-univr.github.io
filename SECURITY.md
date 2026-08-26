# Security and migration safety

This repository is public and is intended to contain only publishable source content and static website assets.

## Never commit

- SQLite databases or database dumps
- legacy server archives or backups
- environment files or credentials
- Django `SECRET_KEY` values
- authentication/session/admin data
- password hashes
- private contact information
- server logs
- migration scratch directories

The legacy CISD application, its database, and its server archive are migration inputs only. Keep them outside this repository and inspect them read-only.

## If sensitive data is committed accidentally

Do not merely delete it in a later commit. Treat it as exposed, rotate any affected credentials, and remove it from Git history using an appropriate history-rewrite procedure before continuing publication.
