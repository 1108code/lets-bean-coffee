USE THIS SMALL UPDATE ONLY

Upload these files to the same paths in GitHub if you only want the latest fixes:
- app/page.tsx
- app/cms/page.tsx
- app/globals.css
- package.json
- tests/encoding-guard.mjs
- public/favicon.svg
- public/icons/bpi.svg
- netlify/functions/cms.cjs

Latest fixes:
- Removes public/internal reviews wording from the website.
- Adds a safety filter so old CMS review copy mentioning reserved/CMS/client feedback will not show publicly.
- Keeps the encoding guard test so broken apostrophe, enye, and copyright characters get caught before deployment.

After upload to GitHub, Netlify should auto-deploy.
