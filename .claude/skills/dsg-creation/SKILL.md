---
name: dsg-creation
description: "Add to or edit Khan Academy Design System Guidelines documentation in storybook. Use this skill when researching or making changes to Foundations, Components or Patterns in the design-system-guidelines repo."
user-invokable: true
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Agent, AskUserQuestion
---

# Creating & editing design system guidelines docs

You are working with a **non-technical designer** to craft design guideline docs. Your job is to make sure that the docs follow the repo's conventions and that they are optimized for MCP/LLMs usage: favor clear structure and tight prose.

Before authoring, read the two exemplars: `__docs__/design-components/banners.mdx` (component page) and `__docs__/design-foundations/colors.mdx` (foundation page).

This repo (`@khanacademy/design-guidelines`) is a **Storybook 10 site that documents how to use Wonder Blocks** — it is *not* a component library. Guideline pages are `.mdx` files under `__docs__/`, grouped into Foundations, Components, and Patterns.

---

## Golden rules

- **Always consider implications for LLM legibility (limiting token context) and a11y.** Pure markdown is best.
- **Minimize noise.** Concise prose, tables for grids, and heavy demos moved out of the page.
- **Reuse authoring components.** Sometimes custom authoring components are best when they semantically convey meaning concisely to an LLM. Before creating a new component, look at the through the current set: (`Do`, `Dont`, `UsageExample`, `Demo`, `Figure`, `Color`, `Principle`/`PrincipleSet`) in the [catalog](references/component-catalog.md). When deciding to make a component, ask the user first if this is something that will be reused. If you do create one, add it to the **catalog**.
- **Usage examples** `Do`, `Dont`, `UsageExample` components all convey system usage semantically and concisely. If the user wants to build a be a one-off `Demo`, it should stay page-local and be alongside other page assets instead of adding to the authoring components dir.
- **Do/dont examples must be semantic** for a11y and screenreaders. See "Choosing a do/dont mechanism" below. Color or proximity cannot be the only signal. Details in [`references/accessibility.md`](references/accessibility.md).
- **Keep it tight.** Use markdown tables for "use when / don't use when" grids (see banners.mdx). Short declarative sentences. Cut filler.

### Technical rules

- **Verify every Wonder Blocks prop rather than guessing.** Use the Wonder Blocks MCP (https://main--5e1bf4b385e3fb0020b7073c.chromatic.com/mcp"): `list-all-documentation` → `get-documentation`.
- **Assets** always import: `import headerImg from "./assets/<page>/header.png"; <img src={headerImg} alt="…" />`. A raw `src="./assets/..."` string will not survive Vite bundling. Every image needs meaningful `alt`.
- **Phosphor icons are from `@phosphor-icons/core`.** `import checkCircleBold from "@phosphor-icons/core/bold/check-circle-bold.svg";` (weights: `bold`, `fill`, `regular`, …). Do not import `@phosphor-icons/react`
- **Color comes from tokens, not raw hex.** Hardcoded hex will not adapt to theming. Tokens live inside the `.tsx` helper components used in `.mdx`.  `style={{}}` is only for demo *layout* scaffolding (widths, gaps, flexbox) — never for colors.

---

## Choosing a do/dont mechanism

There are three, and they are not interchangeable. The JSDoc headers in `__docs__/components/DoDont.tsx` and `Demo.tsx` are the source of truth; summary:

| Use | When |
| --- | --- |
| Bare `<Do />` / `<Dont />` | Inline markers in a prose list or a heading (e.g. `## <Do /> When to use`). |
| `<Demo type="do">` / `type="dont"` | Judging **one whole card-scale example** — adds a full-width labeled bar under it. Pass `explanation` for a short rationale. |
| `<UsageExample type="do">` inside a `<Demo>` | Pairing **small, inline** good/bad examples side by side in one card. Carries the meaning on an accessible `role="group"`. |

---

## New component vs. new props vs. one-off demo

- **Add a prop / variant** to an existing component when the need is a small variation of something that already exists. Prefer this over a new component.
- **Make a new *reusable* component** (in `__docs__/components/`) only when it will likely be used **multiple times, especially across pages**. Match the existing files' style: typed props, a JSDoc header describing intended MDX usage, tokens for all styling.
- **A one-off demo is a page asset, not a shared component.** Keep it page-local (see next section). Do not add single-use visuals to `__docs__/components/`.

When it's a genuine judgment call, surface the trade-off to the user rather than guessing.

---

## Where demo content lives

- **Small, legible demos → inline in the `.mdx`.** Writing the live component tree directly in the page also helps an LLM reader understand the point being made. This is the default (see the `<Banner>` examples in banners.mdx).
- **Heavy demos → extract to a colocated `.tsx`.** If a demo carries substantial JavaScript behavior, state, or styling, it bloats the page and buries the point. Move it to `__docs__/design-<section>/assets/<page>/<Name>.tsx` as a **named export**, colocated with that page's images, and import it relatively:
  ```mdx
  import {BannerIconography} from "./assets/banners/BannerIconography";
  ...
  <Demo><BannerIconography /></Demo>
  ```
  (`assets/<page>/` holds both PNGs and any page-specific demo `.tsx`.) This is the `BannerIconography` pattern — `__docs__/design-components/assets/banners/BannerIconography.tsx`.
- If you're unsure whether a demo is "heavy enough" to extract, explain the pros/cons (page legibility vs. keeping the example visible to readers) and let the user choose.

---

## Authoring a new page

Key rules:

1. **Pick the section and put the file in the matching directory** (note the `design-` prefix):
   - Foundations → `__docs__/design-foundations/`
   - Components → `__docs__/design-components/`
   - Patterns → `__docs__/design-patterns/`
2. **Set `<Meta title>` with the bare section name** (no `design-` prefix), e.g. `<Meta title="Design Guidelines / Components / Feedback / Banners" />`. Components will likely live in a **subcategory**. Foundations and Patterns pages may or may not.
3. **Filename is kebab-case; the page title / Meta name is sentence case** (`text-field.mdx` → "Text field").
4. **Page shape differs by section:**
   - *Component* pages open with a header `<img>`, `# Title`, a `<NeutralBadge label="…" />` tagline, an intro, then `## When to use` / `## When NOT to use` (tables), then Variants / States / Placement / Copy.
   - *Foundation* pages have **no** NeutralBadge and **no** when-to-use tables — they use `## Principles` (`PrincipleSet`/`Principle`) plus topic sections and `## Usage guidelines`.
5. **Adding a page or subcategory needs no config edit.** Discovery is automatic (glob `../__docs__/**/*.mdx`) and subcategories sort alphabetically. Only a brand-new *top-level* section would need a `.storybook/preview.tsx` change.
6. **To keep an unfinished page out of the sidebar, rename it to end in `.draft`** with **no** `.mdx` (e.g. `onboarding-and-setup.draft`). `foo.draft.mdx` is still published.

---

## Verify

1. `pnpm typecheck` — only catches errors in `.tsx` files, not `.mdx`.
2. `pnpm start` (Storybook port 56789) and open the page — **MDX errors only surface here**.
3. Open the Storybook **Accessibility** addon panel on the page; resolve violations (a11y is set to fail CI).
4. Use the **Theme** toolbar to spot-check `syl-dark` — confirm nothing is hardcoded to a light-only color. (Note: the **RTL** toolbar toggle affects *stories* only, not docs pages, so RTL can't be previewed here — rely on tokens/logical properties and the WB components, which handle direction.)
5. Confirm the page appears in the expected sidebar location.

---

## Ship it

A minimal git flow for non-technical contributors. This repo batches docs work onto `docs/*` branches with a single PR (same convention as the `export-design-guidelines` skill) — if such a branch already exists for this work, commit onto it rather than starting a new one.

```bash
git switch main && git pull
git switch -c docs/<short-slug>   # e.g. docs/tooltip-page
# ... make edits ...
git add -A && git commit -m "docs: <what changed>"
git push -u origin HEAD
```

Then open one PR. Do not push to `main` directly. Ask the user before pushing or opening the PR if that hasn't been explicitly requested.

---

## Notes & gotchas

- **Ignore `.claude/worktrees/` copies** — they are git worktrees, not source of truth. Always edit files under the real `__docs__/`.
- **No barrel/index file** — import each authoring component by its relative path (`import Demo from "../components/Demo";`, `import {Do, Dont, UsageExample} from "../components/DoDont";`).
- **Escape entities in tables** — curly apostrophes are fine as literal characters; escape `{`/`}` as `&#123;`/`&#125;` and other JSX-significant characters so MDX doesn't try to parse them.
