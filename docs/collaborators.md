# Collaborators

Collaborators use the same `src/content/people/<slug>.md` records as current members. There is no second people database and no duplicate profile type.

Set:

```yaml
relationship: collaborator
```

`relationship` accepts `member` or `collaborator` and defaults to `member`, so existing records need no change. Current members appear under their CISD group on `/people/`; collaborators appear once in the separate **Collaborators** section.

## Group association

For a member, `groups:` must name at least one current CISD group (`esd`, `parco`, `iot4care`).

A collaborator may have:

```yaml
groups: [esd]
```

when a public source explicitly establishes the collaboration with ESD, or:

```yaml
groups: []
```

when the person is a CISD collaborator but no current CISD group association should be claimed. Do not map former groups such as ForME or NeST onto a current group merely to make the field non-empty.

On a collaborator detail page, current group associations are labelled **Collaborates with** rather than **Group**. The role and `affiliation:` describe the person's current external or departmental position; do not preserve a stale legacy role when a current institutional source exists.

## Legacy profiles

A collaborator who had a legacy CISD profile keeps its verified `legacyId`, exactly like a member. That preserves `/profile/<id>/` compatibility pages. Record the mapping in `docs/migration-map.md`; never guess an id.

## Photographs and contact details

The rules in `docs/people.md` and `docs/content-safety.md` apply unchanged. In particular, a portrait from the old CISD site is not automatically republished: it needs consent for this site and a right-to-publish check. E-mail, telephone and office data from legacy profiles are not migrated.

## Validate

Run `npm run ci`. The content tests enforce that members have at least one current CISD group while collaborators may be ungrouped.
