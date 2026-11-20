# Contributing

Thanks for helping improve Camping Quest Editor!

## Layout

See the [README](README.md#repository-layout) and [docs/architecture.md](docs/architecture.md).

## Workflow

1. Branch from `main`: `git checkout -b feat/short-description`.
2. Edit the source in `src/`, then run `npm run build` to regenerate `index.html` and open it in a browser to test. Commit both. (Never edit `index.html` by hand, since the next build overwrites it.)
3. Keep commits small, with [Conventional Commit](https://www.conventionalcommits.org/) messages (`feat:`, `fix:`, `docs:`, `chore:`).
4. Open a pull request using the template. CI must pass.

## Conventions

- 2-space indentation, UTF-8, LF line endings (see `.editorconfig`).
- Hall projects are deliberately simple beginner code: no frameworks, no JavaScript. Each project lives in its own folder (`index.html`, `style.css`, extra pages) and builds on the previous one (see [docs/architecture.md](docs/architecture.md#the-projects-build-on-each-other)). Aim for about 20 new tasks per project and check the count on the Hall card.
- Change lessons through the app's Teacher view, then export and run `npm run split` (see [docs/architecture.md](docs/architecture.md)). Avoid hand-editing `src/data/course.json`. If you must, keep the `rev` counter increasing and make sure `pin` stays empty.
- Don't commit student progress backups or personal data.

## Secrets and the Teacher PIN

- Run `npm run setup` once after cloning. It enables a pre-commit hook that blocks commits containing a PIN or secret-like value.
- The app stores the PIN as a salted hash in `index.html` when you use **Save to page**. Never commit a page with a PIN set. `npm run check` (and CI) fail if `"pin"` is not empty.
- Don't put personal paths or emails in code or docs.
- Never commit a GitHub access token. A teacher's login token lives only in her browser (Teacher → ⚙️ Settings → 🔑 Teacher account); `npm run check` blocks token-like strings.
