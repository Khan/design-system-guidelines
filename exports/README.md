# Exports

Portable packages of these guidelines for tools outside this repo, generated from one source plus the installed Wonder Blocks tokens. The Storybook docs in `__docs__/` are the reference; these are what gets sent elsewhere.

- `src/`: the source for every export. Edit these files.
  - `DESIGN.md`: core rules for every output. In the Claude system it becomes the README.
  - `guides/`: one guide per output type (Claude artifact, web prototype, slides, diagrams, product UI).
  - `assets/`: logos, shapes, and icons, copied as-is.
  - `claude-design-system/`: what only the Claude system needs: `system.yaml` (title, asset groups), `token-usage.yaml` (a usage note for every token), `components.yaml` (one card per component), `cover.html`.
- `design-md/`: the generated [DESIGN.md](https://github.com/google-labs-code/design.md), for any agent or tool. Served at `/design-md/DESIGN.md` from the Storybook root on every host.
- `claude-design-system/`: the Claude "Wonder Blocks" Design System.
  - `project/`: generated; the system's files in the Claude Design System type's layout.
  - `publish.json`: generated; asset uploads and index keys for the publish skill.
  - `config.json`: hand-edited; the published system's URL and the type release it was checked against.

Both outputs are written by `pnpm exports`, all or nothing. Commit them with your source changes; CI fails if either is stale. Never edit them, or the published system's page: the page is read-only (`"editing": "code"`), and the publish skill stops if it finds a change there.

See [DESIGN.md & Claude Design Systems](../README.md#designmd--claude-design-systems) in the main README for the template syntax.

## The flow

1. Change something upstream (one of the three cases below), run `pnpm exports`.
2. Open a PR. CI checks types, tests, the build, DESIGN.md's lint, and that both outputs are up to date.
3. Merge. GitHub Pages serves the new DESIGN.md.
4. In Claude Code, in this repo, run the **`publish-design-system`** skill ("publish the Claude design system"). It publishes what `origin/main` holds, only the files that changed, stamps the system with the SHA and Wonder Blocks versions, and runs a smoke test.

### After a Wonder Blocks release

The weekly [Wonder Blocks release check](../.github/workflows/wb-release-check.yml) opens an issue when anything is behind npm. Then, on a branch:

```sh
pnpm artifact:check      # what's newer on npm, and whether the import map still matches
pnpm artifact:update     # bump V and the import map in src/guides/claude-artifact.md
pnpm add @khanacademy/wonder-blocks-tokens@<V.tokens>   # keep the installed tokens on the same version as V
pnpm exports
pnpm test
pnpm artifact:preview kitchen-sink    # every component, under the artifact CSP; check both themes
pnpm artifact:preview design-system   # every Claude system card, both themes
```

- Update the "tested together on" date in `src/guides/claude-artifact.md`.
- If `pnpm exports` fails with "no usage note", WB added a token family: add a prefix for it to `src/claude-design-system/token-usage.yaml`.
- If a card breaks, fix its entry in `src/claude-design-system/components.yaml` (props are in each package's `.d.ts`, as the card's README links).
- Review the diff in `design-md/` and `claude-design-system/project/tokens.json`, then PR, merge, publish.

### After a `__docs__/` edit

The exports link to the DSG docs; they don't copy them. Most docs edits need nothing here. Check these:

- **A renamed or moved page** that the exports link: the data-viz pages in `src/DESIGN.md` ("Charts and data visualization") and the `docs:` entries in `src/claude-design-system/components.yaml`. `pnpm exports` fails if a `components.yaml` link points at a missing page; the DESIGN.md links aren't checked yet, so search `src/` for the old path.
- **A changed foundation** (colors, type, spacing, elevation, iconography, illustration, motion): `src/DESIGN.md` restates these, so update the matching section by hand.
- **A changed component rule** (for example in `buttons.mdx`): if the card's "Get these right" in `components.yaml` repeats it, update it there.
- **A changed data-viz example** (`__docs__/design-components/assets/{progress,distribution,trend}-charts/*.tsx`): the pattern cards (ProgressBar, DistributionChart, TrendChart, DataTable) read their colors from these files' `values:` constants at build time. Run `pnpm exports` and publish after the merge. If a constant was renamed, removed or turned into something other than a one-line literal, `pnpm exports` fails and names it: update `values:` in `components.yaml`.

If you changed anything in `src/`, or a data-viz example changed, run `pnpm exports`, and after the merge, publish. If not, there's nothing to publish: the system's links already point at `main`.

### After an `exports/src/` edit

```sh
pnpm exports
pnpm test
pnpm lint:design-md
pnpm artifact:preview design-system   # if you changed a card, the cover or the artifact guide
```

Then PR, merge, publish. To change only one export, put the lines in a `{{#target claude}}` or `{{#target design-md}}` block.
