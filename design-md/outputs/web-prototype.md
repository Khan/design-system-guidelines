# Web prototypes, HTML pages, and Claude artifacts

Read this together with the core
[DESIGN.md](https://khan.github.io/design-system-guidelines/design-md/DESIGN.md).
It covers anything rendered in a browser without the Wonder Blocks React
components: standalone HTML, prototypes, Claude artifacts, and one-pagers.

## Quick start

Every token is published as a CSS custom property. One stylesheet gives you
all three themes, and the `data-wb-theme` attribute picks which one applies:

```html
<!doctype html>
<html lang="en" data-wb-theme="thunderblocks">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- All WB tokens as CSS variables (default, thunderblocks, syl-dark) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-tokens@18/dist/css/index.css" />
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Inconsolata:wght@400;700&family=Noto+Sans:wght@400;700&display=swap" />
  <style>
    /* WB tokens use rem on a 10px root: 1.6rem = 16px. This line is required. */
    html { font-size: 62.5%; }
    html[data-wb-theme="syl-dark"] { color-scheme: dark; }
    body {
      margin: 0;
      font-family: var(--wb-font-family-sans);
      font-size: var(--wb-font-body-size-medium);
      line-height: var(--wb-font-body-lineHeight-medium);
      font-weight: var(--wb-font-weight-medium);
      color: var(--wb-semanticColor-core-foreground-neutral-strong);
      background: var(--wb-semanticColor-core-background-base-subtle);
    }
  </style>
  <script>
    // Follow the OS light/dark preference
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => document.documentElement.setAttribute("data-wb-theme", mq.matches ? "syl-dark" : "thunderblocks");
    apply(); mq.addEventListener("change", apply);
  </script>
</head>
```

Notes:

- **The 62.5% root matters.** Without it, sizing and font tokens come out 1.6× too big. If the host page controls the root font size, don't load the stylesheet. Copy the px values from the core file instead.
- **`data-wb-theme` works on any element.** Put `data-wb-theme="syl-dark"` on one section to get a dark band inside a light page.
- **Build with the CSS variables, not hex,** so dark mode works for free. Variable names are `--wb-` plus the token path joined with dashes, for example `--wb-semanticColor-action-primary-progressive-default-background`, `--wb-sizing-size_160`, `--wb-border-radius-radius_080`, or `--wb-boxShadow-mid`.
- **Page structure:** a `base-subtle` page background, `base-default` cards, one primary button, and Phosphor icons ([web package](https://phosphoricons.com) or inline SVGs).

## Layout

- **Breakpoints** (not tokens): xs ≤ 567px, sm 568–681px, md 682–1023px, lg 1024–1199px, xl ≥ 1200px.
- Phone layouts use a 16px side gutter. Desktop content maxes out around 1200px.

## Component recipes

These recipes mirror the Wonder Blocks components. Values are
`thunderblocks`; use the CSS variables to get `syl-dark` automatically.
Component dimensions come from component-level tokens (`--wb-c-…`), which
are internal to each component and can change between releases.

### Button

| Size | Height | Inline padding |
| --- | --- | --- |
| Small | 26px | 8px |
| Medium (default) | 40px | 16px |
| Large | 44px | 18px |

Corners are 8px, becoming
12px when pressed. Labels are weight
700 in sentence case
(16px, or 18px for
large). No underline.

| Kind | Rest | Hover / press |
| --- | --- | --- |
| Primary | bg `#5753FA`, text `#FFFFFF` | bg `#363498` |
| Secondary | bg `#EBF1FD`, 1px border `#BFCAFF`, text `#5753FA` | border `#6C82FF` |
| Tertiary | transparent, text `#5753FA` | text `#363498`, 2px inset outline `#363498` |
| Destructive primary | bg `#BE2626`, text `#FFFFFF` | bg `#621414` |
| Disabled | bg `#E0E0E1`, text `#B5B6B9` | — |

Learner-facing buttons can add the chonky shadow described in the core file.

### Focus

```css
:focus-visible {
  outline: var(--wb-border-width-medium) solid var(--wb-semanticColor-focus-outer);
  outline-offset: var(--wb-border-width-medium);
  box-shadow: 0 0 0 var(--wb-border-width-medium) var(--wb-semanticColor-focus-inner);
}
```

Every interactive element needs this.

### Text input

- 44px tall, with 12px inline padding and a 8px radius.
- Background `#FFFFFF`, 1px `#8A8B90` border.
- 16px text in `#151521`, placeholder `#717279`.
- **Error:** a 2px `#E22D2D` border, plus a message below the field. Don't rely on the red alone.
- **Read-only:** `#EDEDEE` background, text `#4A4C53`.

### Card

- `#FFFFFF` on a `#F8F9FB` page.
- A 1px `#CBCBCD` border, always.
- Radius 8px and padding 16px by default. Use 12px and 24px for larger, roomier cards.
- To lift a card, add `--wb-boxShadow-low` on top of the border.

> **Draft:** pending design review. The earlier draft used 12px / 24px as the
> card default; these values follow the Wonder Blocks `Card` defaults.

### Banner / callout

- Background, icon, and text come from the intent's feedback tokens (`--wb-semanticColor-feedback-<intent>-subtle-…`). Info is bg `#EBF1FD`, icon `#5753FA`, text `#363498`.
- No visible border in `thunderblocks` (it's transparent), radius 8px, inline padding 16px, and a 18px intent icon.
- The "strong" variant uses a `#151521` background with `#FFFFFF` text.

| Intent | Background | Icon | Text |
| --- | --- | --- | --- |
| Info | `#EBF1FD` | `#5753FA` | `#363498` |
| Success | `#E3F7E3` | `#3C6D4A` | `#24432D` |
| Warning | `#FEF1D0` | `#966B00` | `#5F4500` |
| Critical | `#FFEBEB` | `#BE2626` | `#8E1C1C` |

### Badge

- 12px / 16px text at weight 700.
- 4px block and 8px inline padding, 8px radius, 1px border.
- Neutral: bg `#EDEDEE`, border `#CBCBCD`, text `#151521`.
- Status badges use the feedback tokens from the banner table, with the border `--wb-semanticColor-feedback-<intent>-subtle-border`.
- Badges are non-interactive.

### Link

- Weight 700, color `#5753FA`, hover and press `#363498`. In `syl-dark` it's `#6C82FF`, hover `#DFEAFF`.
- **Links inside running text are always underlined** (1px thick, 2px offset). Color alone isn't enough to mark them.
- Standalone links (navigation, "See all") underline on hover.
