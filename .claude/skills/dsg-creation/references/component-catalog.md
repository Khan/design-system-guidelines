# Authoring component catalog

These live in `__docs__/components/` and exist to be reused. **Never recreate them.** There is no barrel file — import each by relative path from your `.mdx` (`../components/<File>`). Each `.tsx` has a JSDoc header with usage examples; read it when in doubt.

Props marked **required** must be provided; others are optional with the noted default.

**All changes to components must include any changes to props / implementation**

---

## `UsageExample` — accessible good/bad pairs

`import {UsageExample} from "../components/DoDont";`

Wraps a small, inline live example and binds a "Do this / Don't do this" judgment to it structurally. Place **inside a `<Demo>`** so several good/bad examples share one card.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `type` | `"do" \| "dont"` | — | **Required.** The judgment. |
| `children` | `ReactNode` | — | **Required.** The example being judged. |
| `direction` | `"row" \| "column"` | `"row"` | Maps to `flex-direction`; marker side flips automatically in RTL. |
| `style` | `StyleType` | — | Merged into the content area. |

**A11y:** renders `role="group"` + `aria-label` + `data-example-type` on the wrapper; the inner `Do`/`Dont` icon is decorative. This is the *preferred* way to show good vs. bad — never substitute an image with an icon placed beside it.

```mdx
<Demo style={{flexDirection: "column", gap: "16px", alignItems: "stretch"}}>
    <UsageExample type="do"><Banner ... /></UsageExample>
    <UsageExample type="dont"><Banner ... /></UsageExample>
</Demo>
```

---

## `Demo` — full container example

`import Demo from "../components/Demo";` (default export)

Presentational card for embedding live Wonder Blocks examples. Uses the themed surface background and standard card radius. Addresses a single use-case.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | **Required.** The live example(s). |
| `type` | `"demo" \| "do" \| "dont"` | `"demo"` | `"do"`/`"dont"` add a full-width opinionated labeled bar. `"demo"` has no opinion  |
| `explanation` | `ReactNode` | — | Short rationale appended after the "Do"/"Don't" label. Only shown for `do`/`dont`. |
| `style` | `StyleType` | — | Merged into the content area (e.g. `gap` between multiple examples, or `paddingInline: 0` for full-bleed images). |

**A11y:** the do/dont bar uses real visible "Do"/"Don't" text (icon is `aria-hidden`) — meaning never depends on color or icon shape.

---

## `Figure` — captioned image

`import Figure from "../components/Figure";` (default export)

An image paired with a real-text caption (replacing captions baked into the image pixels). Renders semantic `<figure>` / `<figcaption>`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `src` | `string` (imported asset) | — | **Required.** Import the image; don't string-path it. |
| `alt` | `string` | — | **Required.** Describes the image for AT. |
| `caption` | `ReactNode` | — | **Required.** Real-text caption. Shown beneath the image for `type="figure"`; becomes the explanation after the "Do"/"Don't" label for `do`/`dont`. |
| `type` | `"figure" \| "do" \| "dont"` | `"figure"` | `"do"`/`"dont"` replace the caption with a labeled bar (green ✓ / red ✕) attached to the image bottom. `"figure"` shows a plain neutral figcaption. |

**A11y:** the do/dont bar uses real visible "Do"/"Don't" text (icon is `aria-hidden`) — meaning never depends on color or icon shape.

---


## `Do` / `Dont` — inline do/dont markers

`import {Do, Dont} from "../components/DoDont";`

Single Phosphor icon — `Do` is a green filled check-circle, `Dont` a red filled x-circle. Use as a bullet marker in a prose list, or inline in a heading (`## <Do /> When to use`).

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `size` | `"small" \| "medium" \| …` (PhosphorIcon size) | `"medium"` |  |
| `decorative` | `boolean` | `false` | When `false`, the icon is labeled for AT (`aria-label="Do this"` / `"Don't do this"`). Set `true` only when a surrounding element already announces the meaning. |

**A11y:** labeled by default so a standalone icon still conveys meaning; meaning is carried by the check/x *shape* and the label, not color alone.

---

## `Color` — clickable color swatch

`import Color from "../components/ColorSwatch";` (default export)

A swatch card that copies a value to the clipboard and announces it via the WB live-region announcer.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | — | **Required.** Display name. |
| `hex` | `string` | — | **Required.** Hex value; fills the swatch and is shown as text. |
| `semanticToken` | `string` | — | When present, clicking copies the token name instead of the hex. |
| `style` | `StyleType` | — | Merged into the card (e.g. grid widths). |

---

## `Principle` / `PrincipleSet` — foundation principles

`import Principle, {PrincipleSet} from "../components/principle";`

`PrincipleSet` is a responsive grid wrapper; each `Principle` is a card. Used on Foundation pages under `## Principles`.

`PrincipleSet` — `children` only.

| `Principle` prop | Type | Notes |
| --- | --- | --- |
| `label` | `string` | **Required.** Eyebrow label (e.g. "Foundational"). |
| `title` | `string` | **Required.** Principle heading. |
| `description` | `string` | **Required.** One or two sentences. |
