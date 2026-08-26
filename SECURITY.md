# Security and migration safety

This repository is public and is intended to contain only publishable source content and static website assets.

This file is about files that must never be committed. For what may be *published*, and
about whom — personal data, photographs, consent, claims — see
[docs/content-safety.md](docs/content-safety.md).

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

## Where the migration audit lives

The forensic migration audit of the legacy system (which names internal paths,
findings about credentials and personal data) is kept **outside** this repository in
the private migration work area. Do not add it, or excerpts of it, here.

## Automated safeguards

`npm run verify` (also run by CI) fails when a database, dump, archive, `.env` file,
log or migration scratch file is tracked by Git or present in the working tree, and
when development fixture content leaks into the production build.
