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

The weekly [Wonder Blocks release check](../.github/workflows/wb-release-check.yml) does the mechanical part when anything is behind npm. On the branch `wb-release/bump` it runs `artifact:update`, the matching tokens `pnpm add`, `exports`, `test`, `lint:design-md` and `artifact:check`, then opens one PR, "Wonder Blocks release: bump the exports". It lists each step's result, and it's a draft if a step failed. What's left for you:

1. Check out `wb-release/bump`. If a step failed, fix it there (see the list below). The workflow never overwrites a branch that has anyone else's commits; it comments on the PR instead.
2. Run both previews (the last two commands below) and check both themes.
3. Update the "tested together on" date, review the value diff, mark the PR ready, merge, and publish.

Setup, once: turn on "Allow GitHub Actions to create and approve pull requests" in the repo's Actions settings. Without it, the workflow pushes the branch and opens an issue instead. PRs opened with the built-in token don't trigger other workflows, so CI won't run on the bump PR until you set up a GitHub App for it:

1. **Create the app.** In the Khan org's settings, go to Developer settings → GitHub Apps → New GitHub App. This needs an org owner or a GitHub App manager.
   - Name: something like "KA design-system bump". Homepage URL: this repo's URL.
   - Webhook: untick **Active**; the app doesn't receive events.
   - Repository permissions: **Contents: Read and write**, **Pull requests: Read and write**, **Issues: Read and write** (for the fallback issue). Leave everything else at No access.
   - Where can it be installed: **Only on this account**.
2. **Generate a private key** on the app's page (Private keys → Generate). A `.pem` file downloads. Note the **App ID** at the top of the page.
3. **Install it** (Install App → Khan → Only select repositories → `design-system-guidelines`).
4. **Give the workflow the app**, in this repo's Settings → Secrets and variables → Actions:
   - Variables tab: `WB_BUMP_APP_ID` = the App ID.
   - Secrets tab: `WB_BUMP_APP_KEY` = the whole contents of the `.pem` file, including the BEGIN and END lines. Then delete the `.pem` from your computer.
5. **Try it:** Actions → Wonder Blocks release check → Run workflow. The PR should be opened by the app, and build-check should run on it.

Without the app, the workflow still runs with the built-in token: it opens the PR, but CI doesn't run on it until someone pushes to the branch. A fine-grained personal token in the `WB_BUMP_TOKEN` secret also works, but it's tied to one person and expires.

To do it by hand instead, on a branch:

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

## Sharing the Claude system with the org

The system is <https://claude.ai/artifact/Sm1pXU11PLjsNEcPrJ4Hxw> (also in `claude-design-system/config.json`). It's private until an org Owner shares it. Design systems in Claude are a beta on paid plans; on Enterprise an Owner turns the template on first.

1. **Turn design systems on.** An Owner opens **Organization settings → Artifacts** and, under **Templates**, turns on **Design systems**.
2. **Give an Owner access.** Whoever owns the artifact opens it, selects **Share**, and invites an Owner (or Primary Owner) at the highest access level.
3. **Share with everyone.** That Owner opens **Share** on the system and sets the audience to **Anyone at Khan Academy**.
4. **Make it the default.** In the same **Share** dialog, the Owner turns on **Default design system** (or sets it from **Settings → Design systems**). It must be shared with everyone first. There's one org default; setting it replaces the old one.
5. **Retire the standalone system.** Standalone Claude Design closes on December 14, 2026. Don't move its "Wonder Blocks" system over: this repo's system replaces it. If a move already brought it over and made it the default, set this one as the default instead, then delete or unshare the moved copy.

Sharing doesn't change how it's updated: the page stays read-only, and every change still goes through this repo and the publish skill.

## Using it in Claude

- **Pick it:** in a new chat, open **+ → Design system** in the message box and check **Wonder Blocks**. Once it's the org default it's checked for you; the chip under the message box shows which system is on. To make it your own default, use **Set as your default** in its row menu under **Settings → Design systems**.
- **Ask for an artifact:** describe the page and who it's for, for example "Build an artifact: a teacher's class report with three summary cards, a progress chart toward a goal, and a student table with a row menu." Claude reads the system's README, which routes artifacts to its Claude artifact guide: the real Wonder Blocks components from jsDelivr, themed by `data-wb-theme`, following the viewer's light or dark mode.
- **Check the result:** a red "Wonder Blocks page error" box means a component got a wrong prop; paste it back to Claude. Pages should use WB components (no hand-made buttons or inputs), follow your light/dark setting with no theme toggle, and round bars and pills with half their height.
- **Reports and charts:** WB has no chart or table components, so ask for the pattern cards by name (ProgressBar, DistributionChart, TrendChart, SummaryCards, DataTable). Their colors have no dark-theme values yet.
- **Something wrong with the system itself:** it can't be edited on its page. Open an issue or PR in this repo.
