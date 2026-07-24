# Keabetsoe Tau — Portfolio

Static portfolio site (HTML, CSS, vanilla JS). No build step.

## Run locally
From this folder:
```bash
python3 -m http.server 4173
```
Then open http://localhost:4173

## Edit
- **Case study content:** `js/case-data.js` (one entry per project)
- **Case study layouts:** `js/case.js` (renderers keyed by `layout`)
- **Design tokens & styles:** `css/main.css`
- **Pages:** `index.html`, `work.html`, `about.html`, `contact.html`, `case.html`
- **Assets:** `assets/img`, `assets/video`, `assets/fonts`

Commit and push changes as normal — GitHub Pages redeploys automatically.

## Deploy (GitHub Pages)
Repo Settings → Pages → Build and deployment → Deploy from a branch →
Branch: `main`, Folder: `/ (root)` → Save. The site publishes at the URL shown there.
