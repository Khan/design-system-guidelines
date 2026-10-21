# Exports

Portable packages of these guidelines for tools outside this repo, generated from one source plus the installed Wonder Blocks tokens. The Storybook docs in `__docs__/` are the reference; these are what gets sent elsewhere.

- `src/`: the source for every export. Edit these files.
  - `DESIGN.md`: core rules for every output.
  - `guides/`: one guide per output type (slides, web prototype, diagrams, product UI).
  - `assets/`: logos, shapes, and icons, copied as-is.
- `design-md/`: the generated [DESIGN.md](https://github.com/google-labs-code/design.md), for any agent or tool. Run `pnpm exports`; don't edit it, and commit it with your source changes. Served at `/design-md/DESIGN.md` from the Storybook root on every host.
- `claude-design-system/` (in progress): the Claude "Wonder Blocks" Design System, generated from the same source and published to Claude by a skill. Until then, the system is maintained in Claude Design.

See [DESIGN.md & Claude Design Systems](../README.md#designmd--claude-design-systems) in the main README for the template syntax.
