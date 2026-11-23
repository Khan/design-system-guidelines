<img width="1158" height="660" alt="DSG-start" src="https://github.com/user-attachments/assets/2fb1aea4-42ac-4020-8869-0afa802d07ac" />

# design-system-guidelines

This is a living reference for how we build UI at the component, foundation, and pattern level. It documents how things should work, surfaces what needs to change, and will track design debt as we find it.

When making architectural changes, remember that the goal is to keep the general solution and architecture in parity with the `wonder-blocks` repo Storybook such that they can be unified when it makes sense!

## Running locally

After pulling the repo, install dependencies

```sh
pnpm install
```

Then start the Storybook server

```sh
pnpm start
```

It should launch the following URL, locked to port :**56789** so that it can coexist nicely with a locally running wonder-blocks Storybook

```sh
http://localhost:56789/
```

## MCP endpoint

While the Storybook is running, it serves an MCP endpoint for agents:

```
http://localhost:56789/mcp
```

For Claude Code:

```sh
claude mcp add --transport http design-guidelines http://localhost:56789/mcp
```

## DESIGN.md & Claude Design Systems

`exports/` holds portable packages of these guidelines for tools outside this repo. The Storybook docs are the reference; exports are what gets sent elsewhere, so an agent can make things (decks, diagrams, prototypes) that look like Khan Academy. Both exports come from one source, `exports/src/`, plus the installed Wonder Blocks tokens.

| Export | What it is | Who reads it | Where it lives |
| --- | --- | --- | --- |
| DESIGN.md | Khan Academy's [DESIGN.md](https://github.com/google-labs-code/design.md): plain Markdown with the visual language, plus a guide per output type | Any agent or tool, from a public URL | Generated into `exports/design-md/`, served at `/design-md/` |
| Claude Design System | The "Wonder Blocks" design system in Claude: a README and guides, tokens, assets, and the Wonder Blocks components | Claude, when the design system is selected | Today it's maintained in Claude Design. Generating it from `exports/src/` into `exports/claude-design-system/` and publishing it with a skill is in progress |

- `exports/src/`: the source for both. Edit these files.
- `exports/design-md/`: generated. Don't edit it.

### DESIGN.md

The generated files are served at `/design-md/` from the Storybook root, so the path is the same on every host:

| Host | URL |
| --- | --- |
| GitHub Pages (canonical) | `https://khan.github.io/design-system-guidelines/design-md/DESIGN.md` |
| Chromatic | `<chromatic storybook URL>/design-md/DESIGN.md` |
| Local (`pnpm start`) | `http://localhost:56789/design-md/DESIGN.md` |

Links between the files are relative (`guides/slides.md`, `../DESIGN.md`), so they stay on whichever host you're reading from. The generator fails if a template links to another file by its published URL or links to a file that doesn't exist. The only absolute link allowed is the canonical address stated once in `DESIGN.md`.

### Editing the source

After editing a template, run:

```sh
pnpm exports
```

and commit both `exports/src/` and `exports/design-md/`. `pnpm build` also regenerates `exports/design-md/`, and CI fails if the committed output is stale or hand-edited.

Templates are Markdown with token references that resolve against the installed `@khanacademy/wonder-blocks-tokens`:

| Reference | Renders |
| --- | --- |
| `{{tb:semanticColor.core.background.base.default}}` | the `thunderblocks` value (`#FFFFFF`) |
| `{{dark:semanticColor.core.background.base.default}}` | the `syl-dark` value (`#252531`) |
| `{{tb:font.family.sans \| first}}` | the first font family (`Plus Jakarta Sans`) |
| `{{name:sizing.size_160}}` | the CSS variable name (`--wb-sizing-size_160`) |
| `{{meta:tokensVersion}}`, `{{meta:tokensMajor}}` | the installed tokens version |

- A path is the token's JS path; it maps to `--wb-` plus the path joined with dashes. Component tokens work too (`c.button.root.sizing.height.medium`).
- In the YAML front matter, every reference must be inside a double-quoted string: `primary: "{{tb:…}}"`.
- An unknown or mistyped reference fails the build with the file and line.
- Values without a token (breakpoints, chonky shadow offsets, display sizes, slide grid, motion) are written as plain text and labeled as not tokens.

After bumping `@khanacademy/wonder-blocks-tokens`, run `pnpm install && pnpm exports` and review the diff in `exports/design-md/`. `pnpm test` runs the generator's tests; `pnpm lint:design-md` runs the DESIGN.md spec linter.

### Claude artifacts with real Wonder Blocks components

`exports/src/guides/claude-artifact.md` tells an agent how to build a Claude artifact with the real WB React components. It's the setup the Claude Design System relies on, so publish it with the rest of `exports/src/`. Artifacts run under a strict content security policy:
- scripts only from a few CDNs, jsDelivr's `/npm/` included;
- stylesheets only from Google Fonts;
- images only as `data:`/`blob:`;
- no `fetch`.

The guide's page skeleton works around that. Every piece below is needed, and `scripts/exports/artifact.test.ts` fails if one goes missing:

| Piece | Why |
| --- | --- |
| `html { font-size: 62.5%; }` | WB tokens are `rem` on a 10px root, as on khanacademy.org. Without it, everything renders 1.6× too big. |
| Token CSS from `wonder-blocks-tokens@…/dist/css/index.css/+esm` | jsDelivr serves the CSS as a module that injects a `<style>` tag. A `<link>` is blocked, and inlining it would cost 155 KB. |
| `data-wb-theme` on `<html>`, not `ThemeSwitcher` | Modals, menus, popovers, tooltips and calendars portal to `<body>`, outside any wrapper. |
| Import map: `@phosphor-icons/core@…/<weight>/<name>.svg/+esm` → `@iconify-icons/ph@2.0.0/<name>/+esm` | jsDelivr rewrites WB's built-in icon imports to URLs that 404. That breaks dropdown, modal, form, banner, accordion, badge, tabs, popover, search field, link and both date pickers. |
| Boot turns those icons into data-URI strings that are also React elements | PhosphorIcon needs a string for `mask-image: url()` and `startsWith`. Button and IconButton `cloneElement` anything that isn't a string. |
| Import map: every `react@X/` and `react-dom@X/` → `@18.2.0/` | react-popper, react-window, react-day-picker, @floating-ui/react and react-router each pull in their own React. Two Reacts break hooks. |
| Import map: `aphrodite@1.2.5` → `2.4.0` | jsDelivr's build of 1.2.5 has no named exports. |
| `wb()` Proxy, duplicate-React check, page error handler | Agents' most common mistake is a wrong import name, and these turn it and other failures into a readable error on the page instead of a blank page. |

The pinned versions (`const V`) and the import map belong together. After a Wonder Blocks release:

```sh
pnpm artifact:check      # does the import map still match V? also lists newer WB versions on npm
pnpm artifact:update     # bump V to latest and rewrite V + the import map in the guide source
pnpm exports
pnpm artifact:preview kitchen-sink   # every component, under the artifact CSP, at http://localhost:8765
```

- In the preview, check that there's no red error box and that `window.__errs` is empty. Click through the modal, menus, popover, tooltip and calendar in both themes, then update the tested date in the guide.
- `pnpm artifact:preview` with no argument serves the guide's own skeleton.
- `pnpm artifact:preview path/to/page.html` checks any artifact page.
- `artifact:check` exits non-zero on a module it can't map. Usually that's a new dependency with its own React, or a CommonJS-only package; add a rule in `scripts/exports/artifact.ts`.
- Also retest icons whenever `wonder-blocks-icon`, `button` or `icon-button` changes, because the icon workaround depends on their internals.

Verified on 2026-11-23 in two ways. Fresh agents built four test pages from the guide on the first try under an emulation of the artifact CSP. Then a page with cards, badges, a tooltip, an accordion, a modal and a banner was checked live on claude.ai.
