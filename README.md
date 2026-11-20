# Camping Quest Editor

A gamified HTML/CSS editor and course platform for a young student (course lessons 9–32). In the app it appears as *99 Nights Code Quest*, themed on the Roblox game *99 Nights in the Forest*.

**Live demo: https://zk-qmy.github.io/camping-quest-editor/**

> Open `index.html` in a browser, or use the live demo above. No install, build or server needed.

![Camping Quest Editor: Blocks editor with a live preview and quest panel](docs/images/screenshot.png)

## Features

- Student view: Type and Blocks editors, quests, points, collection and stickers
- Teacher view for editing lessons, settings and rewards
- Hall of demo projects, one per module. They build on each other (Night Camp grows from Module 3 to Module 8), with about 20 tasks each
- Teacher accounts: the Teacher view only opens after a teacher logs in with a GitHub account that can edit the project (students and visitors only see the login box), and 💾 Save to page commits the course data to GitHub, so the live page updates (no server needed)
- Pop-up quiz: a 🧠 button appears at a random time (every 15 to 30 minutes by default). A right answer gives random bonus points. It expires after 10 minutes if he does not answer. The teacher writes and manages the questions in the Teacher view (🧠 Quiz tab)
- Five background themes (night forest, dawn, sunset, winter, calm dark) from the 🎨 Theme button, saved with the student's progress
- Numbered tasks ("Task 1:", "Task 2:" and so on) in every quest

## Quick start

```bash
git clone <repo-url>
cd camping-quest-editor
# then open index.html in any modern browser
```

Progress is saved in the browser's local storage on that computer. Use **💾 Backup** in the app to move progress between computers.

## How to see the app and projects

There is no server to start. You view everything by opening an `.html` file in a browser (Chrome or Edge).

**The app**

- In File Explorer, double-click `index.html` in the project folder, **or**
- Paste this into the browser's address bar (change the path to where you cloned the repo):
  `file:///path/to/camping-quest-editor/index.html`, **or**
- In a terminal in the project folder, run `start index.html` (Windows), `open index.html` (macOS) or `xdg-open index.html` (Linux).

If it opens as text in an editor, right-click the file, choose **Open with**, and pick your browser.

**The Hall projects**

Each project is a normal website. Open the `index.html` inside its folder:

| Project | Open this file |
|---|---|
| Night Camp | `hall-projects/m3-night-camp/index.html` |
| Night Camp: style.css | `hall-projects/m4-night-camp-style/index.html` |
| Night Camp: Two pages | `hall-projects/m5-night-camp-pages/index.html` |
| Night Camp: Flexbox | `hall-projects/m6-night-camp-flexbox/index.html` |
| Night Camp: Hover and position | `hall-projects/m7-night-camp-hover/index.html` |
| Night Camp: Final site | `hall-projects/m8-night-camp-final/index.html` |

The pages link to each other (for example Home, Survival tips), so click through the menu. Pictures such as `campfire.png` are not included, so they show as broken images.

The app's **Hall** button also shows these projects inside the app.

## How to change the code

`index.html` is generated from the files in `src/`, so don't edit it by hand. `npm run build` shows nothing on screen. It only rewrites `index.html` and prints `Built index.html`. You then open or refresh `index.html` in the browser to see the result.

1. Install [Node.js](https://nodejs.org) 18 or newer (once).
2. Edit files in `src/` (for example `src/js/14-teacher.js`).
3. In a terminal in the project folder, run:

   ```bash
   npm run build
   ```

4. Refresh `index.html` in the browser.

| Command | What it does |
|---|---|
| `npm run build` | Regenerate `index.html` from `src/` |
| `npm run check` | Check that `index.html` is up to date with `src/`, that `hall-projects/` matches the app, and that no PIN or secret is committed |
| `npm run setup` | Turn on the pre-commit hook that blocks commits containing a PIN or secret (run once after cloning) |
| `npm run split` | Rebuild `src/` from an `index.html` exported from the app's Teacher view |

There is no `npm install` step; the project has no dependencies. The Hall projects need no build at all.

## Repository layout

```
.
├── index.html            # the whole app, generated from src/ (single file)
├── src/                  # app source: template, styles/, js/, data/
├── scripts/cq.mjs        # build / split / check tooling (Node 18+)
├── package.json
├── hall-projects/        # Hall demo projects, one folder per module
│   ├── m3-night-camp/
│   ├── m4-night-camp-style/
│   ├── m5-night-camp-pages/
│   ├── m6-night-camp-flexbox/
│   ├── m7-night-camp-hover/
│   └── m8-night-camp-final/
├── lessons/              # final code for individual lessons
├── docs/                 # architecture notes
└── .github/              # CI, Pages deploy, issue and PR templates
```

## Hall projects

| Phase | Lessons | Project | Folder |
|---|---|---|---|
| 1 · Module 3 | 9–12 | Night Camp | [`m3-night-camp`](hall-projects/m3-night-camp) |
| 2 · Module 4 | 13–16 | Night Camp: style.css | [`m4-night-camp-style`](hall-projects/m4-night-camp-style) |
| 3 · Module 5 | 17–20 | Night Camp: Two pages | [`m5-night-camp-pages`](hall-projects/m5-night-camp-pages) |
| 4 · Module 6 | 21–24 | Night Camp: Flexbox | [`m6-night-camp-flexbox`](hall-projects/m6-night-camp-flexbox) |
| 5 · Module 7 | 25–28 | Night Camp: Hover and position | [`m7-night-camp-hover`](hall-projects/m7-night-camp-hover) |
| 6 · Module 8 | 29–32 | Night Camp: Final site | [`m8-night-camp-final`](hall-projects/m8-night-camp-final) |

Each project builds on the one before it (Night Camp grows from Module 3 to Module 8), so every project adds only about 20 new tasks and shows the concepts of its module: inline styles (3), selectors and style.css (4), borders, lists and a second page (5), flexbox (6), :hover, ::before and positioning (7), gradients, shadows, transforms and video (8). The first project is a school landing page with a mint and green look. Every section has a heading, its picture and its text together, so the page is easy to follow.

## Updating content

Lessons and settings edited in the app are stored inside `index.html` when saved from the hosted version. Replace `index.html` with the exported page, then run `npm run split` to update `src/`. To change code, edit `src/` and run `npm run build`. See [docs/architecture.md](docs/architecture.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Licensed under the [MIT License](LICENSE).
