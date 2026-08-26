# Development fixtures (DEV-FIXTURE)

Sample content used only to exercise layouts during development:

    npm run dev:fixtures      # dev server with this content
    npm run build:fixtures    # builds into dist-fixtures/

Nothing in this folder is ever part of the deployed site: `npm run build` reads
src/content/ and src/data/ instead, and `npm run verify` fails if the marker
"DEV-FIXTURE" appears in the production build. Delete this whole folder (and the
`*:fixtures` scripts in package.json) once real content exists, if you like.
