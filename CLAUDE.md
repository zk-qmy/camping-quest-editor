# CLAUDE.md

Notes for Claude Code when working on this repo. No secrets belong here or anywhere in the repo.

## What this is

Camping Quest Editor: a gamified HTML/CSS course app for one young student (course lessons 9-32). It shows as "99 Nights Code Quest" (Roblox "99 Nights in the Forest" theme). It is a static, single-file app (`index.html`) with no backend and no server. Live demo: https://zk-qmy.github.io/camping-quest-editor/ (GitHub Pages, repo `zk-qmy/camping-quest-editor`, branch `main`).

## Golden rules

- **Never edit `index.html` by hand.** Edit `src/`, then run `npm run build`. Commit both.
- **Run `npm run check` before every commit.** It checks that `index.html` matches `src/`, that `hall-projects/` matches `HALL_DEFAULT`, and that no PIN or secret is committed. CI runs the same.
- **The Teacher PIN must stay empty in the repo** (`"pin": ""` in `src/data/course.json` and in the embedded data). The app stores it as a salted PBKDF2 hash when someone uses "Save to page". Never commit a page with a PIN set. `.githooks/pre-commit` enforces this (enable once with `npm run setup`).
- Don't put personal info in code, docs, commits or this file: no real emails, local paths (`d:\...`), or names. The git commit email for this repo is the GitHub noreply address; keep it that way.
- Commit messages end with the Co-Authored-By line from the session's attribution instructions. Push only when asked.

## Layout

- `src/template.html`, `src/styles/*.css`, `src/js/*.js` and `src/data/course.json` are the source. `scripts/cq.mjs` builds them into `index.html`.
- The JS files share one scope (one IIFE, not ES modules). The numeric filename prefix sets the order.
- `src/js/15-hall.js` holds `HALL_DEFAULT` (the Hall projects as JSON). `hall-projects/` mirrors it as normal websites. Folder names are mapped in `HALL_DIRS` in `scripts/cq.mjs`.
- `src/js/04-break-final-code-into-quests.js` turns a lesson's `finalCode` into quests. `src/js/14-teacher.js` is the Teacher view and PIN logic. `src/js/07-student.js` is the student quest panel.
- `docs/architecture.md` has the details. `lessons/` holds reference final code. `docs/images/screenshot.png` is used by the README.

## Commands

- `npm run build`: regenerate `index.html`.
- `npm run check`: sync check + hall check + secrets check.
- `npm run split`: rebuild `src/` from an `index.html` exported from the app.
- `npm run setup`: enable the pre-commit hook (once per clone).

## Hall projects (important)

- One site, "Night Camp", grows from Module 3 to Module 8. Each project's `basedOn` is the previous one (m3 has none), so each adds about **20 tasks** (the user's target).
- A task is generated per new HTML element and per new CSS declaration. Keep additions small. A later project must be a superset of the earlier one, and unchanged `pages` are repeated.
- Each Hall card shows "N quests · M tasks" (`hallCount()` in `15-hall.js`). Re-measure after any change. Counts at last measurement: m3 20, m4 20, m5 24, m6 18, m7 19, m8 15. Each project must show its module's concepts (see the table in docs/architecture.md): M3 inline styles, M4 selectors + style.css, M5 borders/lists/2nd page, M6 flexbox, M7 hover + pseudo-elements + positioning, M8 gradients/shadows/transforms/video. The first project mimics a school landing page (black header/footer, centred heading, pictures). Spend the CSS budget on high-impact declarations (content width, padding, card background and radius, header gradient).
- When changing a project, update both `HALL_DEFAULT` and `hall-projects/<folder>/`, then run `npm run build && npm run check`.

## Background themes

`src/js/15a-background-themes.js` plus the `#forestBg[data-theme=...]` rules at the end of `src/styles/01-99-nights-theme.css`. Five themes (night, dawn, sunset, winter, plain). The choice is stored in `P.theme`. To add one: add to `THEMES` and add a CSS rule.

## Course data (`src/data/course.json`)

Three demo lessons: Lesson 1 Build the guide, Lesson 2 Forest style, Lesson 3 Camp schedule. Keep them short (2-3 tasks per quest, no placeholder tasks). Bump `rev` when editing by hand. Student progress lives in the browser's localStorage, not in the repo.

## Testing

- There are no unit tests yet. Verify with `npm run check`.
- To test the real app, use headless Chrome on a temp copy of `index.html` with an injected script (insert it before the *last* `</body>`, because earlier ones appear inside embedded strings), then `--dump-dom`. Opening the Hall and reading the `.hcount` lines is a quick way to check task counts.

## Environment gotchas (Windows, Git Bash)

- Use forward slashes. `gh` is not installed. Use the GitHub REST API with curl for public info (for example Actions runs).
- When editing with Python, be careful with `\n` inside string literals, and check line endings before replacing multi-line text. For big content, write files with the Write tool instead of shell heredocs.
- Printing emoji from Python in the terminal can fail. Set `PYTHONIOENCODING=utf8`.

## Deployment

GitHub Pages with Source = GitHub Actions. `.github/workflows/pages.yml` publishes only `index.html`, `hall-projects/` and `lessons/`. If a deploy fails at `configure-pages`, Pages is not enabled in the repo settings.

## Backend note

There is no backend. The PIN check runs in the browser, so it only keeps a child out of the Teacher view. If a backend is ever added: secrets go in environment variables, `.env` goes in `.gitignore`, and a `.env.example` with fake values is committed.
