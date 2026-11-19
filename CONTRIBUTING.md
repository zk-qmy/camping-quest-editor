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
- Hall projects are deliberately simple beginner code: no frameworks, no JavaScript. Each project is self-contained in its own folder (`index.html`, `style.css`, extra pages).
- Change lessons through the app's Teacher view, then export and run `npm run split` (see [docs/architecture.md](docs/architecture.md)). Don't hand-edit `src/data/course.json`.
- Don't commit student progress backups or personal data.
