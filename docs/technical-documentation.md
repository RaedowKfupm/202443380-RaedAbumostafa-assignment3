# Technical Documentation — Assignment 3

## Overview

A static single-page portfolio built with semantic HTML, one stylesheet, and one vanilla JavaScript file. There are no runtime dependencies or build tools. Assignment 3 extends the Assignment 2 code; earlier features (navigation, project filters, contact-form validation) are unchanged.

## Architecture

| File | Responsibility |
|---|---|
| `index.html` | Page structure. A tiny inline script in `<head>` applies the saved theme before first paint to avoid a light/dark flash. `js/script.js` is loaded with `defer`. |
| `css/styles.css` | Design tokens, layout, components, responsive rules, dark theme, and reduced-motion handling. |
| `js/script.js` | Independent `initialize…()` functions, each guarded so a missing element never throws. |

## 1. API integration — GitHub repositories

- **Endpoint:** `GET https://api.github.com/users/RaedowKfupm/repos?per_page=100` (public, no key needed).
- **Flow (`initializeRepos` → `loadRepos`):**
  1. Show "Loading repositories…".
  2. Use the `sessionStorage` cache if it is newer than 10 minutes. This saves requests and protects GitHub's 60-requests-per-hour anonymous limit.
  3. Otherwise `fetch` with an `AbortController` that times out after 8 s.
  4. Rate-limit responses (403/429), other non-OK statuses, timeouts, and offline state each produce a friendly message. A **Try again** button reruns the load.
  5. Forks are removed, and only the six fields the cards use are kept and cached.
- **Security:** cards are built with `createElement` and `textContent` (no `innerHTML`), so repo text can't inject markup. External links use `rel="noreferrer"`.

## 2. Complex logic

- **Repo view pipeline (`render`):** language filter → text search on name + description → sort with one of three comparators (`updated`, `name`, `stars` with name tie-break). It also shows an empty-result message and a "Showing X of Y" count. The language list is built from the data with a `Set`.
- **Contact form (from A2):** trimmed values; name ≥ 2, valid email regex, message ≥ 10 characters. Errors are linked to fields with `aria-describedby` and `aria-invalid`, and focus moves to the first invalid field.
- **Visitor greeting:** whitespace is normalised, a name of at least 2 characters is required, and the greeting depends on the hour (morning/afternoon/evening).
- **Time-on-site timer:** a 1-second interval that skips counting while the tab is hidden (`document.hidden`).

## 3. State management

| State | Storage | Key |
|---|---|---|
| Theme (light/dark) | `localStorage` (plain string) | `portfolio.theme` |
| Visitor name | `localStorage` (JSON) | `portfolio.visitorName` |
| Repo search, language, sort | `localStorage` (JSON) | `portfolio.repoView` |
| Time on site | `sessionStorage` | `portfolio.timeOnSite` |
| GitHub response cache | `sessionStorage` | `portfolio.repoCache` |

All storage access goes through a small `storage` helper wrapped in `try/catch`, so the site still works when storage is blocked (e.g. private mode). The theme button exposes its state with `aria-pressed`.

### Dark theme design

Dark sections (projects, contact form, footer) already use `--ink`. The dark theme only overrides the light-section tokens (`--paper`, `--text`, `--surface`, `--muted`, `--line`, `--nav-bg`) under `:root[data-theme="dark"]` and sets `color-scheme` so native form controls match.

## 4. Performance

- Converted `.jpeg`/`.png` images to WebP and resized the hero photo to 960 px wide: 942 KB → 120 KB total (about 87% smaller).
- Fixed the `width`/`height` attributes to the real image dimensions to prevent layout shift (CLS).
- Removed unused files: three unreferenced SVGs and a `.code-workspace` file inside `assets/`.
- Hero image `fetchpriority="high"`, project images `loading="lazy"`, scroll listener is `passive`.
- One CSS and one JS file, no frameworks or web fonts.
- **Lighthouse:** run it in Chrome DevTools → Lighthouse (Mobile + Desktop) on the GitHub Pages URL or `python -m http.server`, and record the scores here before submitting.

## 5. Testing performed

Automated browser run (Playwright + Chrome, desktop 1280 px and mobile 390 px), with the GitHub API mocked so results don't depend on the network:

| Check | Result |
|---|---|
| Repos load, forks excluded | 3 of 3 shown (fork hidden) |
| Sort by stars | Order changes correctly |
| Search with no match | Empty-state message shown |
| Language filter | Only matching repo shown |
| Reload remembers sort + language | Yes |
| API returns 500 | Friendly error + **Try again** shown |
| Theme persists across reload | Yes (light and dark) |
| Visitor name saved and shown after reload | Yes |
| Time-on-site counter runs | Yes |
| Empty contact form submit | Error message shown |
| JavaScript errors | None (only the intentional 500 in the failure test) |

`node --check js/script.js` passes. Dark and light themes were checked visually on desktop and mobile screenshots.

## Browser compatibility

Uses standard APIs (`fetch`, `AbortController`, `Intl.DateTimeFormat`, `replaceChildren`, optional chaining, WebP) that are supported in current Chrome, Edge, Firefox, and Safari (14+).

## Known limitations

- The contact form has no backend; it only validates.
- The GitHub API allows 60 unauthenticated requests per hour per IP. The 10-minute cache reduces requests, and an error message is shown if the limit is reached.
