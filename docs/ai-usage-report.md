# AI Usage Report — SWE 363 Assignment 3

## Tools and use cases

| Tool (model) | How it was used |
|---|---|
| **Claude — Claude Opus 5.5** (Anthropic, claude.ai agent session) | Read the Assignment 3 guidelines and my Assignment 2 repository. Implemented the new features: GitHub API section, repo search/filter/sort, remembered dark mode, stored visitor name, and time-on-site counter. Converted and resized the images, removed unused assets, ran automated browser tests with Playwright, and drafted the README, technical documentation, and this report. |

Starting point: my Assignment 2 portfolio (`202443380-RaedAbumostafa-assignment2`). AI use in Assignments 1 and 2 is documented in those repositories and is not repeated here.

## Benefits and challenges

**Benefits**
- Fast implementation of several connected features while keeping the existing Assignment 2 code style (guarded `initialize…()` functions, design tokens).
- Automated browser checks covered success, empty, and failure states of the API, which I could not easily trigger by hand.
- Image optimisation cut image weight by about 87%.

**Challenges**
- **Dark mode:** the original stylesheet used `--ink` both as a text colour and as the dark-section background, so simply swapping colours would break the dark sections. The fix was new theme tokens (`--text`, `--surface`, `--nav-bg`) that change only the light sections.
- **API limits:** GitHub allows only 60 anonymous requests per hour. This needed a session cache and a clear rate-limit message.
- **Image dimensions:** the HTML `width`/`height` values from Assignment 2 did not match the real images, which causes layout shift. This was found and fixed.

## Learning outcomes

- How to use `fetch` with `async/await`, check `response.ok`, handle specific status codes, and cancel a slow request with `AbortController`.
- How to chain `filter` → `filter` → `sort` to build a view from shared state, and save that state with `localStorage`.
- The difference between `localStorage` (kept across visits) and `sessionStorage` (kept for one tab session), and why storage access should be wrapped in `try/catch`.
- Why a theme should be applied in `<head>` before the page paints, and how CSS custom properties make theming cheap.
- Why `textContent` is safer than `innerHTML` for data from an API.

## Responsible use and modifications

- I set the scope (build on Assignment 2, meet every Assignment 3 requirement) and the AI worked from my existing code instead of starting over.
- All AI-generated code was checked by running it: `node --check`, plus a Playwright test script covering every new feature in light/dark mode, desktop and mobile, and an API failure case. Screenshots were reviewed visually.
- No secrets or API keys are used; the GitHub endpoint is public.
- I reviewed the generated code and documentation and can explain each feature (see `technical-documentation.md`).
- The original AI output, before any of my own edits, is in the evidence ZIP under `artifacts/`.

## Usage log

| ID | Tool (model) | Date | Purpose | Files affected | What I changed and how I verified it |
|---|---|---|---|---|---|
| C01 | Claude (Claude Opus 5.5) | 2026-11-21 | Read the assignment and my A2 repo, then implement all A3 features, optimise images, write docs, and create the repo and evidence ZIP | `index.html`, `css/styles.css`, `js/script.js`, `assets/images/**`, `README.md`, `docs/*.md` | Added the GitHub API section with error/retry, search + language filter + sort, remembered theme/name/repo view, a time-on-site counter, and WebP images. Verified with a Playwright run (mocked API success and 500 error, reload persistence, mobile 390 px, dark mode) with no JS errors, plus `node --check`. |
| A01 | Claude (Claude Opus 5.5) | 2026-11-21 | Snapshot of the AI-generated project files before any of my own edits | Whole project | Stored in the evidence ZIP as `artifacts/A01-ai-output/`. Compare it against the final repository to see my changes. |
| A02 | Claude (Claude Opus 5.5) | 2026-11-21 | Browser test script and screenshots used for verification | Not in the repo (evidence only) | Stored as `artifacts/A02-verification/`. |

## Declaration

I, **Raed Abumostafa** (Student ID **202443380**), declare that this report documents all of my AI use in Assignment 3, that the attached evidence contains the complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration is treated as plagiarism under KFUPM regulations.

Signed: **Raed Abumostafa** — ID **202443380** — Date: **21 November 2026**
