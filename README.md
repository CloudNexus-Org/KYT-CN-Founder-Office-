<!-- AI assisted development -->

# Employee Directory

A static, framework-free **employee directory** with search, grouped sections, and responsive profile cards. Built with HTML, CSS, and JavaScript.

## Features

- Card-based layout with light theme and subtle shadows  
- **Search** across name, role, department, location, and skills  
- **Sections**: Leadership, Technology, Revenue Operations  
- **Google Fonts**: Plus Jakarta Sans  
- Placeholder **profile images** (generated initials via [DiceBear](https://www.dicebear.com/) when no photo URL is set)  
- Accessible basics: skip link, live search status, semantic sections  
- **Favicon** (`favicon.svg`) and **SEO / Open Graph** meta tags in `index.html`  

## Local setup

No build step required.

1. Clone or download this project.  
2. Open `index.html` in a browser **or** serve the folder with any static server, for example:

```bash
# Python 3
python3 -m http.server 8080

# Then visit http://localhost:8080
```

## Project structure

```
├── index.html      # Markup, meta tags, font links
├── favicon.svg     # Site icon
├── css/
│   └── styles.css  # Layout (Grid/Flexbox), cards, search, responsive rules
├── js/
│   └── app.js      # Employee data, filtering, rendering
├── .github/
│   └── workflows/
│       └── deploy-github-pages.yml   # CI: deploy to Pages on push to main
└── README.md
```

## Deploy on GitHub Pages (GitHub Actions)

This repo includes a workflow **Deploy to GitHub Pages** (`.github/workflows/deploy-github-pages.yml`). It runs on every **push to `main`** and on **manual dispatch** (Actions tab → run workflow).

1. **Create a new repository** on GitHub named exactly **`employee-directory`** (public, or private with a plan that supports private Pages).

2. **Push this code** to the `main` branch (replace `YOUR_USERNAME`):

```bash
cd /path/to/this/project
git init   # skip if already a git repo
git add .
git commit -m "Initial commit: employee directory"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/employee-directory.git
git push -u origin main
```

3. **Turn on GitHub Pages with Actions**  
   - Repo → **Settings** → **Pages**  
   - Under **Build and deployment** → **Source**, choose **GitHub Actions** (not “Deploy from a branch”).  
   - The first successful run of **Deploy to GitHub Pages** will publish the site.

4. If prompted, approve the **`github-pages`** environment the first time (Settings → Environments).

5. After the workflow finishes, the site will be at:

```text
https://YOUR_USERNAME.github.io/employee-directory/
```

Replace `YOUR_USERNAME` with your GitHub username.

### Workflow details

| Trigger | When |
|--------|------|
| `push` to `main` | Automatic deploy |
| `workflow_dispatch` | Manual run from the **Actions** tab |

The workflow copies only publishable assets into `_site` (`index.html`, `css/`, `js/`, `favicon.svg`) and uploads that folder—no build step required.

## Updating employee data

Edit the `EMPLOYEES` array in `js/app.js`. Each person can include:

- `group`: one of `Leadership`, `Technology`, `Revenue Operations` (must match `GROUP_ORDER` in the same file)  
- `photoUrl`: optional; if `null`, the initials placeholder is used  
- `skills`: array of strings (empty shows “Not listed”)  
- `bio`: string or `null` (null shows a short placeholder message)  

## License

Use and modify as needed for your organization.
