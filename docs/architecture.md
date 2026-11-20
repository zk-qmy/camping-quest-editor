# Architecture

## The app: `src/` builds `index.html`

The app ships as one self-contained `index.html` (about 300 KB), so it works by double-clicking and on GitHub Pages. For maintainability the source is split up in `src/`, and `index.html` is generated from it.

```
src/
├── template.html          # page shell: <head>, markup, {{STYLES}} {{DATA}} {{SCRIPT}} slots
├── styles/                # CSS, one file per section, concatenated in filename order
├── data/course.json       # lessons, quests, shop items, PIN (always empty in the repo), `rev` counter
└── js/                    # app code, one file per section, concatenated in filename order
    ├── 02-data.js              # load/save DATA, progress
    ├── 04-break-final-code-into-quests.js
    ├── 05-blocks.js            # Blocks editor
    ├── 06-checks.js            # quest checker
    ├── 07-student.js           # student view, collection and shop
    ├── 09-backup-code-...js    # save / restore progress
    ├── 11-screen-stickers-...js
    ├── 12-guide.js
    ├── 13-reports-...js
    ├── 14-teacher.js           # Teacher view, PIN (salted PBKDF2 hash, lockout)
    ├── 15-hall.js              # Hall: HALL_DEFAULT, project cards with quest/task counts
    ├── 15a-background-themes.js # 🎨 Theme picker (stored as P.theme)
    ├── 15b-popup-quiz.js       # 🧠 pop-up quiz (student side)
    └── 16-init.js
scripts/cq.mjs             # build / split / check (Node 18+, no dependencies)
```

The JS files share one scope: the build wraps them all in a single IIFE, so they are *not* ES modules and order matters (the numeric prefix sets it).

### Commands

| Command | What it does |
|---|---|
| `npm run build` | Regenerate `index.html` from `src/` |
| `npm run check` | Fail if `index.html` is out of date with `src/`, or if `hall-projects/` differs from the projects embedded in the app (runs in CI) |
| `npm run split` | Overwrite `src/` from `index.html` |
| `npm run setup` | One-time: set `core.hooksPath` to `.githooks` so the pre-commit hook runs `check-secrets` |

### Two ways content changes

1. **Code changes** (features, styling, fixes): edit files in `src/`, run `npm run build`, commit both `src/` and `index.html`.
2. **Content changes made in the app** (the Teacher view saves lessons and settings into the hosted `index.html`): download the exported page over `index.html`, run `npm run split`, review the diff (usually only `src/data/course.json`), then commit. `split` verifies that `build` reproduces the file exactly before finishing.

Student progress lives in the browser's `localStorage`; the app's **Backup** button exports it.

## `hall-projects/`

One folder per module. Each is a normal static website (`index.html`, `style.css`, extra pages). File names match the links used inside the pages, so each folder opens directly in a browser. The same projects are embedded in the app as `HALL_DEFAULT` (`src/js/15-hall.js`), and `npm run check` fails if the two differ (folder names are mapped in `HALL_DIRS` in `scripts/cq.mjs`).

| Folder | Module | Lessons |
|---|---|---|
| `m3-night-camp` | 3 | 9–12 |
| `m4-night-camp-style` | 4 | 13–16 |
| `m5-night-camp-pages` | 5 | 17–20 |
| `m6-night-camp-flexbox` | 6 | 21–24 |
| `m7-night-camp-hover` | 7 | 25–28 |
| `m8-night-camp-final` | 8 | 29–32 |

### How the page is organised

Every section has a heading, its picture (if it has one) and its text together, in an order a visitor can follow: header menu → title, mascot and intro → **What we teach** (three pictures with captions in a table) → **About us** → **What to bring** (list, Module 5) → **Our classes** (three cards, Module 6) → **Prices** (table, Module 5) → **Watch a class** (video, Module 8) → contacts footer. A new section goes in the place where a visitor would expect it, and each picture needs a caption or a heading that says what it is.

### The projects build on each other

Night Camp is one site that grows from Module 3 to Module 8. Each project has `basedOn` set to the previous one, so a student's *Practice* starts from the finished previous project and only builds what is new. The app compares the new `finalCode`, `finalCss` and `pages` with the base's and generates the quests from the difference.

- m3 → m4 → m5 → m6 → m7 → m8 (m3 has no base). The first project is a school landing page. Look: pale mint (`honeydew`) page, `darkgreen` header and footer, white cards, orange accents. No grey backgrounds.
- Each project must show the concepts of its module:

| Module | Concepts shown |
|---|---|
| 3 | HTML structure, headings, paragraphs, images, a table of pictures with captions, menu links to an `id`, `style="…"` |
| 4 | `style.css`, tag, class, id and descendant selectors |
| 5 | margin and padding, solid, dashed, dotted and double borders, `ul` with a picture bullet, a table, a `nav` menu, a second page |
| 6 | containers, `display: flex`, `justify-content`, `align-items` |
| 7 | `:hover`, `::before`, `::after`, `position` fixed and absolute |
| 8 | gradients, shadows, `transform`, `transition`, `<video>` |

- Each project adds about 20 tasks (currently 23, 23, 26, 20, 19, 16). More text, list items and table rows cost no extra tasks, so put extra content there. A task is generated per new HTML element and per new CSS declaration, so keep new pages and rules small.
- A later project must be a superset of the earlier one: keep the earlier markup and CSS, and add to it. Pages (`pages` in `HALL_DEFAULT`) that did not change must be repeated unchanged.
- The Hall card shows the count (for example "10 quests · 21 tasks"), computed by `hallCount()` in `15-hall.js`. Check it after changing a project.
- To change a project, edit it in both places: the `HALL_DEFAULT` JSON in `15-hall.js` and its folder in `hall-projects/`. Then run `npm run build && npm run check`.

## Background themes

The sky behind the app is `#forestBg` (created in `01-forest-background.js`). `15a-background-themes.js` adds the 🎨 Theme button and five themes (night, dawn, sunset, winter, plain). The chosen id is stored in `P.theme` (so it is part of the progress backup) and applied as `data-theme` on `#forestBg`. Each theme is a block of CSS at the end of `src/styles/01-99-nights-theme.css`. To add a theme: add an entry to `THEMES` in the JS and a `#forestBg[data-theme=...]` rule in the CSS.

## Pop-up quiz

- **Content** lives in `DATA.quiz` (so it is saved with the course and exported with it): `{ on, min, max, expire, pmin, pmax, items: [{ id, q, opts: [4 strings], ans: index, why }] }`. `min`/`max` are minutes between quizzes, `expire` the minutes he has to answer after it pops up (default 10), `pmin`/`pmax` the bonus points range. The teacher edits it in the Teacher view → 🧠 Quiz (`tQuiz()` in `14-teacher.js`).
- **Student side** is `src/js/15b-popup-quiz.js`. Progress fields in `P` (so they are part of the Backup): `quizNext` (time of the next quiz), `quizWait` (a quiz is waiting), `quizShown` (when it popped up, used for the expiry), `quizMissed` (expired quizzes), `quizCur` (the question shown, kept until answered), `quizSeen` (questions already asked, so they do not repeat until all were used), `quizRight`, `quizWrong`.
- **Flow:** every 20 seconds `quizTick()` checks the clock. When `quizNext` has passed, the 🧠 button (`#quizBtn`) shows and pulses. Clicking it opens one question with shuffled answers. A right answer gives a random number of points between `pmin` and `pmax` (written to `P.points` and `P.log`); a wrong answer shows the right one. Either way the next quiz is scheduled randomly between `min` and `max` minutes. **Later** closes the popup and keeps the same question waiting, but only until `expire` minutes after it popped up. After that `quizExpire()` removes the button, closes an open popup, counts it in `quizMissed`, gives no points and schedules the next quiz.
- A question is only used when it has text, at least 2 non-empty answers, and the right answer is one of them. The Teacher tab marks unused questions.
- **Try a quiz now** in the Teacher tab opens a question without giving points or changing the schedule.

## Student view details

- Tasks are numbered "Task 1:", "Task 2:" and so on by a CSS counter (`.task .ttext::before` in `src/styles/00-preamble.css`), restarting in each quest.
- Quests of the lessons in `course.json` are saved with the lesson. Hall projects generate theirs on demand.

## Deployment

`.github/workflows/pages.yml` publishes `index.html`, `hall-projects/` and `lessons/` (copied to `_site/`) to GitHub Pages. In the repo settings, Pages → Source must be **GitHub Actions**. `.github/workflows/ci.yml` runs `npm run check` plus link checks on every push and pull request.

## `lessons/`

Reference "final code" for individual lessons, one folder each.

## Known gaps

- The pages reference images (`campfire.png`, `wolf.png`, ...) that are not in the repo.
- No automated tests for the quest checker (`06-checks.js`) yet; that would be the best next investment.
