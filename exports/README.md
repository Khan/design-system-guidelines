# Exports

Portable packages of these guidelines for tools outside this repo. They are generated from one source plus the installed Wonder Blocks tokens. The Storybook docs in `__docs__/` are the reference; these are what gets sent elsewhere.

- `src/`: the source. Edit these.
  - `DESIGN.md`: core rules for every output.
  - `guides/`: one guide per output type (slides, web prototype, diagrams, product UI).
  - `assets/`: logos, shapes, and icons, copied as-is.
- `design-md/`: the generated [DESIGN.md](https://github.com/google-labs-code/design.md). Run `pnpm exports`; don't edit it, and commit it with your source changes. Served at `/design-md/DESIGN.md` from the Storybook root on every host.

See the [DESIGN.md section of the main README](../README.md#designmd) for the template syntax.
