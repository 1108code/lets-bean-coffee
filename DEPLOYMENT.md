# Let's Bean Coffee Netlify + GitHub Deployment Guide

This project is prepared for GitHub + Netlify deployment with a shared CMS.

## What Gets Deployed

- Public website: `/`
- CMS page: `/cms`
- Netlify Function CMS API: `/.netlify/functions/cms`
- Static deploy output: `netlify-dist`
- Netlify build command: `npm run build:netlify`
- Netlify publish directory: `netlify-dist`

The CMS saves published content to Netlify Blobs through a Netlify Function. That means edits and uploaded photos can appear on desktop, tablet, and mobile after publishing.

## Local Preview

Install dependencies:

```bash
npm install
```

Run the normal local preview:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/
http://localhost:3000/cms
```

Local preview still has a browser fallback. The shared online CMS storage works after the project is deployed to Netlify.

Test the Netlify static build locally:

```bash
npm run build:netlify
npm run preview:netlify
```

Open:

```text
http://localhost:4173/
http://localhost:4173/cms
```

## GitHub Setup

1. Create a new repository on GitHub.
2. Open a terminal inside this project folder.
3. If Git is not initialized yet:

```bash
git init
```

4. Add and commit the files:

```bash
git add .
git commit -m "Prepare Let's Bean Coffee website for Netlify"
```

5. Connect your GitHub repository:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

If the remote already exists, use:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

## Netlify Setup

1. Go to Netlify.
2. Choose Add new site.
3. Choose Import an existing project.
4. Connect GitHub.
5. Select the repository.
6. Use these build settings:

```text
Build command: npm run build:netlify
Publish directory: netlify-dist
Node version: 22
```

The included `netlify.toml` already contains those settings.

7. Add this environment variable in Netlify before or after the first deploy:

```text
CMS_PASSWORD=choose-a-private-password
```

Use a password the client can keep private. They will enter this on `/cms` before clicking Publish.

8. Click Deploy site.

## After Deployment

Open:

```text
https://YOUR-NETLIFY-SITE.netlify.app/
https://YOUR-NETLIFY-SITE.netlify.app/cms
```

CMS test:

1. Open `/cms`.
2. Enter the CMS password.
3. Change a small text field.
4. Click Publish.
5. Open the public website on another device or private browser window.
6. Confirm the update appears.

Photo upload test:

1. Open `/cms`.
2. Upload one category or review photo.
3. Click Publish.
4. Refresh the public website on mobile and desktop.

Uploaded photos are compressed in the browser before saving, which helps keep the CMS friendly for free hosting. Still, avoid uploading very large galleries. Two rotating photos per category and a few review photos is the right amount for this site.

## Editable In CMS

- Hero text
- Menu headings, note, CTA
- Menu categories and two rotating photos per category
- About copy and photo
- Private room copy, labels, buttons, photo
- Review section copy
- Review text and review photos
- Contact and social links
- Order/payment/footer safe text

## Locked In CMS

- Copyright
- Layout and responsive structure
- Navigation anchor behavior
- Form logic
- Payment logo styling
- Logo/favicon/core assets
- Animations and code-level behavior

## Important Notes

- Do not share the CMS password publicly.
- If `CMS_PASSWORD` is missing in Netlify, the CMS can still publish, but it is not protected.
- If you change `CMS_PASSWORD`, redeploy or let Netlify refresh the function environment.
- The CMS does not create a full e-commerce checkout. It updates website content and photos only.
