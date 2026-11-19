# Architecture

## The app: `src/` builds `index.html`

The app ships as one self-contained `index.html` (about 300 KB), so it works by double-clicking and on GitHub Pages. For maintainability the source is split up in `src/`, and `index.html` is generated from it.

```
src/
├── template.html          # page shell: <head>, markup, {{STYLES}} {{DATA}} {{SCRIPT}} slots
├── styles/                # CSS, one file per section, concatenated in filename order
├── data/course.json       # lessons, quests, shop items, PIN, `rev` counter
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
    ├── 14-teacher.js           # Teacher view
    ├── 15-hall.js              # Hall (includes HALL_DEFAULT)
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

### Two ways content changes

1. **Code changes** (features, styling, fixes): edit files in `src/`, run `npm run build`, commit both `src/` and `index.html`.
2. **Content changes made in the app** (the Teacher view saves lessons and settings into the hosted `index.html`): download the exported page over `index.html`, run `npm run split`, review the diff (usually only `src/data/course.json`), then commit. `split` verifies that `build` reproduces the file exactly before finishing.

Student progress lives in the browser's `localStorage`; the app's **Backup** button exports it.

## `hall-projects/`

One folder per module. Each is a normal static website (`index.html`, `style.css`, extra pages). File names match the links used inside the pages, so each folder opens directly in a browser. The same projects are embedded in the app as `HALL_DEFAULT` (`src/js/15-hall.js`).

| Folder | Module | Lessons |
|---|---|---|
| `m3-night-camp` | 3 | 9–12 |
| `m4-forest-news` | 4 | 13–16 |
| `m5-ranger-guide` | 5 | 17–20 |
| `m6-night-gear-store` | 6 | 21–24 |
| `m7-night-gear-store-2` | 7 | 25–28 |
| `m8-ranger-portfolio` | 8 | 29–32 |

## `lessons/`

Reference "final code" for individual lessons, one folder each.

## Known gaps

- The pages reference images (`campfire.png`, `wolf.png`, ...) that are not in the repo.
- No automated tests for the quest checker (`06-checks.js`) yet; that would be the best next investment.
