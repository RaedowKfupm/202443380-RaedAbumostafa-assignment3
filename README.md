# Raed Abumostafa — SWE 363 Assignment 3

A responsive single-page portfolio for KFUPM SWE 363 **Assignment 3: Advanced Functionality**. It builds on the Assignment 2 portfolio (project filters and accessible contact-form validation) and adds a live GitHub API section, remembered user preferences, a time-on-site counter, and a performance clean-up.

## Features

| Requirement | Implementation |
|---|---|
| API integration | **Repositories** section loads my public repos from the GitHub REST API (`/users/RaedowKfupm/repos`). Shows loading, empty, and friendly error states with a **Try again** button; requests time out after 8 seconds. |
| Complex logic | Repos can be **searched + filtered by language + sorted** (recently updated, name, stars) at the same time. Contact form checks empty fields, minimum lengths, and email format before accepting. Project cards filter by category. Greeting changes with the time of day. |
| State management | **Light/dark mode** is remembered (`localStorage`) and follows the system preference on first visit. **Visitor name** is stored and shown as a greeting, with a "Not you?" reset (show/hide form). The repo search, language, and sort choices are remembered. **Time on site** survives reloads in the same tab (`sessionStorage`). |
| Performance | Images converted to WebP and resized (≈942 KB → ≈120 KB), unused SVGs and a stray `.code-workspace` file removed, correct `width`/`height` on images to avoid layout shift, lazy-loading below the fold, GitHub response cached for 10 minutes. |

## Run locally

No installation or build step is needed.

1. Clone the repository:
   ```bash
   git clone https://github.com/RaedowKfupm/202443380-RaedAbumostafa-assignment3.git
   cd 202443380-RaedAbumostafa-assignment3
   ```
2. Open `index.html` in a browser, **or** start a local server (recommended):
   ```bash
   python -m http.server 8000
   ```
3. Visit <http://localhost:8000/>.

An internet connection is needed for the Repositories section. Without one, the section shows an error message and a retry button; the rest of the site works offline.

## How to use

- **Theme:** click **Dark mode / Light mode** in the navigation bar. Your choice is kept on your next visit.
- **Greeting:** type your name under the hero and press **Save name**. Use **Not you? Change name** to clear it.
- **Repositories:** type in **Search**, choose a **Language**, and pick a **Sort** order. Choices are remembered.
- **Projects:** filter the project cards by **All**, **RF Sensing**, or **Computer Vision**.
- **Contact:** the form validates input locally. *It is a demo: nothing is sent or stored.*

## Project structure

```
├── README.md
├── index.html
├── .gitignore
├── css/styles.css
├── js/script.js
├── assets/images/
│   ├── profile/raed-portrait.webp
│   └── projects/{wifi-rf-diffusion,ai-video-captioning}.webp
└── docs/
    ├── ai-usage-report.md
    └── technical-documentation.md
```

## AI use summary

Claude (Claude Opus 5.5) was used to implement the Assignment 3 features, convert images, run browser checks, and draft the documentation. I reviewed the code and tested the features. Full details, the usage log, and the signed declaration are in [`docs/ai-usage-report.md`](docs/ai-usage-report.md). Technical details are in [`docs/technical-documentation.md`](docs/technical-documentation.md).

## Live site

Optional: enable GitHub Pages (Settings → Pages → Deploy from branch `main`, root) to publish at `https://raedowkfupm.github.io/202443380-RaedAbumostafa-assignment3/`.
