UPLOAD THIS SMALL UPDATE ONLY

Replace these exact files in your GitHub repository:

1. app/page.tsx
   - Restores public reviews section
   - Automatically changes review heading/copy once real CMS reviews are added
   - Adds subtle footer credit line

2. app/globals.css
   - Styles reviews coming-soon state, CMS guide boxes, footer credit, and payment logo fixes

3. app/cms/page.tsx
   - Adds per-section CMS quick guides/manual notes
   - Updates default review heading capitalization

4. public/favicon.svg
   - Replaces the generic blue browser tab icon with Let's Bean Coffee branding

5. public/icons/bpi.svg
   - Crops the BPI logo canvas so the visible logo is larger

6. netlify/functions/cms.cjs
   - Keeps the CMS publish diagnostics/fix

After uploading/replacing these files in GitHub, Netlify will auto-deploy.
Do not upload node_modules.
Do not upload the full project if you only need this update.
