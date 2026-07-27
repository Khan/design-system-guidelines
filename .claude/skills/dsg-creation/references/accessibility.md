# Accessibility in guideline pages

Accessibility is not a final polish step — it's the reason several of the authoring components exist. A sighted reader infers "this is the good example" from a green check sitting next to an image. A screen-reader user or an LLM reading the source gets **nothing** from that proximity. The components below make the connection explicit and machine-readable. Use them.

## Core rules

- **Pair good/bad inline examples with `UsageExample`, not an image + adjacent icon.** `UsageExample` renders `role="group"` + `aria-label="Do this" / "Don't do this"` + `data-example-type`, so the judgment is announced structurally and is parseable from the DOM. An icon placed beside a picture conveys the meaning only visually — don't do it.
- **Never rely on color alone.** Every do/dont affordance also carries a shape (check vs. ✕) and/or real text ("Do" / "Don't"). When you document a component's own states, make sure meaning survives without color (this is exactly what the Colors foundation preaches).
- **Real text beats text baked into an image.** Use `Figure`'s `caption` prop for captions and `Demo`'s bar/`explanation` for labels. Text in a PNG can't be read by AT, translated, selected, or restyled for dark mode.
- **Every image needs meaningful `alt`.** Describe what the image shows, and if it's not clear, flag it for the user. `Figure` requires `alt`; plain `<img>` must include it too.
- **Decorative icons are hidden.** When an icon only echoes adjacent text (e.g. the icon inside a Demo bar), it's `aria-hidden`. The bare `<Do />`/`<Dont />` markers are the exception — they're *labeled* because they stand alone.
- **Color from tokens, never raw hex.** Tokens resolve per theme; a hardcoded hex will look wrong (or invisible) in `syl-dark`. Keep color inside the `.tsx` helpers; `.mdx` are consumers, and inline styles should be very rare, for layout only.

## Verifying

- **a11y addon panel:** `pnpm start`, open the page, check the Accessibility panel. Violations fail CI (`test: "error"`), so resolve them before shipping.
- **Theme:** use the **Theme** toolbar to switch to `syl-dark` and confirm nothing is hardcoded light-only. (The default docs theme is `thunderblocks`.)
- **RTL note:** the **Language Direction** toolbar toggle applies to *stories only*, not docs pages, so you can't preview RTL on an `.mdx` page. Rely on tokens and logical properties (`paddingInline`, `flexDirection`) and on the Wonder Blocks components themselves, which handle direction — don't hardcode left/right.
- **Headings:** keep a sane heading order (`##` then `###`); the docs table of contents is built from `h2`–`h4`.
