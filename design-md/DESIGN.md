---
# Generated from design-md-src/DESIGN.md: edit that file, then run pnpm design-md
version: alpha
name: Khan Academy — Wonder Blocks (Shape Your Learning)
description: >-
  Visual language for Khan Academy products and materials, sourced from the
  Wonder Blocks design system. Values below are the `thunderblocks` theme
  (light). Its dark counterpart is `syl-dark`. Do NOT use the Wonder Blocks
  `default` ("Classic") theme values for new work.
colors:
  primary: "#5753FA"
  primary-strong: "#363498"
  primary-subtle: "#EBF1FD"
  primary-border: "#BFCAFF"
  on-primary: "#FFFFFF"
  background: "#FFFFFF"
  background-subtle: "#F8F9FB"
  background-strong: "#151521"
  neutral-subtle: "#EDEDEE"
  text: "#151521"
  text-secondary: "#4A4C53"
  text-subtle: "#717279"
  border: "#CBCBCD"
  border-strong: "#4A4C53"
  critical: "#BE2626"
  critical-subtle: "#FFEBEB"
  success: "#3C6D4A"
  success-subtle: "#E3F7E3"
  warning: "#966B00"
  warning-subtle: "#FEF1D0"
  focus: "#5753FA"
  khanmigo: "#5F1E5C"
  mastery: "#9059FF"
typography:
  heading-xxlarge: { fontFamily: "Plus Jakarta Sans", fontSize: "32px", fontWeight: "700", lineHeight: "40px" }
  heading-xlarge: { fontFamily: "Plus Jakarta Sans", fontSize: "24px", fontWeight: "700", lineHeight: "32px" }
  heading-large: { fontFamily: "Plus Jakarta Sans", fontSize: "20px", fontWeight: "700", lineHeight: "28px" }
  heading-medium: { fontFamily: "Plus Jakarta Sans", fontSize: "18px", fontWeight: "700", lineHeight: "24px" }
  heading-small: { fontFamily: "Plus Jakarta Sans", fontSize: "16px", fontWeight: "700", lineHeight: "20px" }
  body-medium: { fontFamily: "Plus Jakarta Sans", fontSize: "16px", fontWeight: "500", lineHeight: "24px" }
  body-small: { fontFamily: "Plus Jakarta Sans", fontSize: "14px", fontWeight: "500", lineHeight: "18px" }
  body-xsmall: { fontFamily: "Plus Jakarta Sans", fontSize: "12px", fontWeight: "500", lineHeight: "16px" }
  mono: { fontFamily: "Inconsolata", fontSize: "16px", fontWeight: "400", lineHeight: "24px" }
rounded:
  none: "0px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "24px"
  # Not a token: WB's radius_full is 50%, which the spec can't express as a dimension.
  full: 9999px
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "16": "64px"
  "24": "96px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-medium}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.on-primary}"
  button-primary-pressed:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 16px"
  button-tertiary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "16px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    height: "44px"
    padding: "0 12px"
  banner-info:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary-strong}"
    rounded: "{rounded.sm}"
    padding: "16px"
---

# Khan Academy Design (Wonder Blocks)

This file tells an agent how to make anything look like Khan Academy: a slide
deck, a diagram, a standalone HTML prototype, a Claude artifact, a one-pager,
or production UI. This core file holds the rules that apply to every output.
Read it, then read the one guide for what you're making (see
[What are you making?](#what-are-you-making)). Together they're complete.

The YAML front matter follows the
[DESIGN.md spec](https://github.com/google-labs-code/design.md). The prose
explains intent. Token values come from the Wonder Blocks
[tokens source](https://github.com/Khan/wonder-blocks/tree/main/packages/wonder-blocks-tokens/src/theme)
(currently `@khanacademy/wonder-blocks-tokens@18.0.0`), which
wins if anything here disagrees. The guidance is hosted in
[Khan/design-system-guidelines](https://github.com/Khan/design-system-guidelines).

## What are you making?

| If you're making… | Also read |
| --- | --- |
| Product UI in a Wonder Blocks codebase | [outputs/product-ui.md](https://khan.github.io/design-system-guidelines/design-md/outputs/product-ui.md) |
| Standalone web prototype, HTML page, or Claude artifact | [outputs/web-prototype.md](https://khan.github.io/design-system-guidelines/design-md/outputs/web-prototype.md) |
| Slide deck | [outputs/slides.md](https://khan.github.io/design-system-guidelines/design-md/outputs/slides.md) |
| Diagram, flowchart, or chart | [outputs/diagrams-and-data-viz.md](https://khan.github.io/design-system-guidelines/design-md/outputs/diagrams-and-data-viz.md) |
| Something else | This file plus the closest guide. State your assumptions. |

Guides may extend this file but never override it. Each value has one home: when a guide points to another guide for something (slides point to the data viz guide for chart colors), that guide wins.

## Which theme

Wonder Blocks ships three token themes. **Use `thunderblocks` (light) and
`syl-dark` (dark).** They are the current Khan Academy look, internally
called **Shape Your Learning (SYL)**.

| Theme | Use it? | What it is |
| --- | --- | --- |
| `thunderblocks` | **Yes, the default for light** | SYL brand. Plus Jakarta Sans, indigo `#5753FA`, cool neutrals. |
| `syl-dark` | **Yes, the default for dark** | Dark counterpart of `thunderblocks`. It inherits fonts and sizes and inverts surfaces. |
| `default` | **No** | Legacy "Classic" look: Lato, blue `#1865F2`. It's only called "default" because it binds to `:root`. Don't copy its values. |

There is also a `"dark"` entry in `SupportedThemes`, but it has no tokens. Ignore it.

If you read hex values out of `@khanacademy/wonder-blocks-tokens` source, the
docs site, or `tokens/color.ts`, you'll often get `default` values. Check
which theme a value came from before you use it.

## How tokens are delivered

- **CSS variables.** Every token is a CSS custom property in one stylesheet that holds all three themes: `https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-tokens@18/dist/css/index.css`. The `data-wb-theme` attribute (`thunderblocks` or `syl-dark`) on any element picks the theme for that subtree.
- **Naming.** A variable is `--wb-` plus the token path joined with dashes. The color tables below show paths after `--wb-semanticColor-`, so `core-background-base-default` means `--wb-semanticColor-core-background-base-default`.
- **React.** With Wonder Blocks installed, the `semanticColor`, `font`, `sizing`, `border`, and `boxShadow` JS exports resolve to the same variables.
- **No CSS available** (PowerPoint, Keynote, Figma, an SVG file): use the hex and px values in this file.

## Overview

Khan Academy is a free, world-class education for anyone, anywhere. The
visual language has to feel **warm, capable, and encouraging**: a patient
tutor, not a game show and not an enterprise dashboard.

- **Calm surfaces, one strong signal.** White and near-white surfaces with cool gray structure. Indigo `#5753FA` is the single action and brand color, and it carries more weight the less it appears.
- **Shapes are the brand.** Illustration is flat and geometric: hexagons, circles, rounded rectangles. No gradients, bevels, or dimensional shading. Complexity comes from composition, not surface effects.
- **Friendly, rounded, sturdy.** 8px corners on controls and cards, and "chonky" buttons with a solid offset shadow on learner-facing surfaces.
- **Audience sets the volume.** Learner-facing work is playful and saturated, and Khanmigo is central. Teacher, admin, and parent work is more restrained: illustration is an occasional moment of warmth inside a dense layout.
- **Accessible by default.** WCAG AA contrast, and color is never the only way meaning gets across.

## Colors

Pick colors by **role**, not by appearance. If a red looks nice but the
element isn't an error or a destructive action, it's the wrong token.

### Surfaces and text

| Role | Token (`--wb-semanticColor-…`) | thunderblocks | syl-dark |
| --- | --- | --- | --- |
| Page / card background | `core-background-base-default` | `#FFFFFF` | `#252531` |
| Subtle page background | `core-background-base-subtle` | `#F8F9FB` | `#151521` |
| Inverse / strong surface | `core-background-base-strong` | `#151521` | `#FFFFFF` |
| Neutral fill (chips, wells) | `core-background-neutral-subtle` | `#EDEDEE` | `#4A4C53` |
| Primary text | `core-foreground-neutral-strong` | `#151521` | `#EDEDEE` |
| Secondary text | `core-foreground-neutral-default` | `#4A4C53` | `#CBCBCD` |
| Subtle text / captions | `core-foreground-neutral-subtle` | `#717279` | `#A0A1A4` |
| Text on filled color | `core-foreground-knockout-default` | `#FFFFFF` | `#151521` |
| Divider / quiet border | `core-border-neutral-subtle` | `#CBCBCD` | `#4A4C53` |
| Control border | `core-border-neutral-default` | `#8A8B90` | `#8A8B90` |
| Strong border | `core-border-neutral-strong` | `#4A4C53` | `#CBCBCD` |
| Modal scrim | `core-background-overlay-default` | `rgba(21,21,33,0.60)` | `rgba(21,21,33,0.80)` |

### Intent colors

Each intent comes in subtle, default, and strong steps for background,
foreground, and border (`core-<background|foreground|border>-<intent>-<step>`).
"Instructive" is the brand/primary intent. **For text on a subtle background,
use the strong foreground.** The default foregrounds of warning and neutral
fall below 4.5:1 on their subtle backgrounds.

**thunderblocks**

| Intent | Background subtle / default / strong | Foreground default / strong | Border subtle / default |
| --- | --- | --- | --- |
| Instructive (brand) | `#EBF1FD` / `#5753FA` / `#363498` | `#5753FA` / `#363498` | `#BFCAFF` / `#6C82FF` |
| Success | `#E3F7E3` / `#579F6C` / `#3C6D4A` | `#3C6D4A` / `#24432D` | `#BCEBBB` / `#579F6C` |
| Warning | `#FEF1D0` / `#FEE7AD` / `#966B00` | `#966B00` / `#5F4500` | `#FEE7AD` / `#FCC539` |
| Critical | `#FFEBEB` / `#BE2626` / `#621414` | `#BE2626` / `#8E1C1C` | `#FBB1B1` / `#E22D2D` |
| Neutral | `#EDEDEE` / `#717279` / `#4A4C53` | `#4A4C53` / `#151521` | `#CBCBCD` / `#8A8B90` |

**syl-dark**

| Intent | Background subtle / default / strong | Foreground default / strong | Border subtle / default |
| --- | --- | --- | --- |
| Instructive (brand) | `#222149` / `#5753FA` / `#8DA2FF` | `#6C82FF` / `#DFEAFF` | `#5753FA` / `#6C82FF` |
| Success | `#1A2924` / `#579F6C` / `#97D39E` | `#72BB82` / `#D5F3D5` | `#579F6C` / `#72BB82` |
| Warning | `#312405` / `#FCB706` / `#FDD673` | `#FCB706` / `#FEF1D0` | `#D69900` / `#FCB706` |
| Critical | `#3B141A` / `#E22D2D` / `#F97F7F` | `#F97F7F` / `#FBB1B1` | `#BE2626` / `#E22D2D` |
| Neutral | `#4A4C53` / `#8A8B90` / `#EDEDEE` | `#CBCBCD` / `#EDEDEE` | `#4A4C53` / `#8A8B90` |

### Fixed brand colors (same in every theme)

| Role | Token | Value |
| --- | --- | --- |
| Khanmigo (AI tutor) primary | `khanmigo-primary` | `#5F1E5C` |
| Khanmigo secondary | `khanmigo-secondary` | `#F2EDF2` |
| Mastery | `mastery-primary` | `#9059FF` |
| Focus ring (outer) | `focus-outer` | `#5753FA` |

### Graphics palette (illustration, data viz, diagrams, decks)

Illustration and expressive graphics use these categorical hues, never
arbitrary hex values (`graphics-characters-flesh-<hue>-background-<step>`):

| Hue | Subtle | Default | Strong | Typical use |
| --- | --- | --- | --- | --- |
| Blue (indigo) | `#6C82FF` | `#5753FA` | `#4340D0` | Brand, primary series |
| Cyan | `#57BAFD` | `#28A9FF` | `#2485C7` | Secondary series, admin role |
| Green | `#72BB82` | `#579F6C` | `#3C6D4A` | Growth, completion, parent role |
| Magenta | `#F670C1` | `#E83FA4` | `#BB3183` | Gems, rewards, celebration |
| Orange | `#F97B4F` | `#F8551A` | `#C8481A` | Streaks, energy, learner role |
| Yellow | `#FCC539` | `#FCB706` | `#D69900` | Attempted / in progress, teacher role |

Yellow has no character token, so its row uses the same primitive steps
(yellow 40/30/20) and isn't generated. Each hue also has light tints for
fills, the primitive 60–90 steps, which aren't published as CSS variables:
blue `#DFEAFF`, cyan `#CCE9FE`, green `#D5F3D5`, magenta `#FAD4EC`, orange
`#FEDFD8`, yellow `#FEEAB8`.

**Learning states** (`learning-<background|foreground>-progress-<state>-…`).
These colors are for fills and graphics such as progress nodes and bars, not
for text:

| State | Fill | Icon / mark |
| --- | --- | --- |
| Not started | `#CBCBCD` | `#4A4C53` |
| Attempted | `#FEE7AD` | `#966B00` |
| Complete | `#BCEBBB` | `#2C5037` |

### Color rules

- Body text is `#151521` on `#FFFFFF`. Use pure black only for third-party brand marks.
- Use **one** filled indigo element per view, slide, or card: the primary action, or the one thing you want noticed.
- Text needs 4.5:1 contrast. Large text (24px and up, or 19px and up when bold), control borders, and meaningful graphics need 3:1. Strong foreground tokens pass 4.5:1 on every subtle and base background.
- Never let color carry meaning alone. Pair it with an icon, a label, weight, or a pattern.
- Don't put green next to critical red to mean good versus bad without labels.

## Typography

**Plus Jakarta Sans** for everything: headings, body, and UI.
**Inconsolata** for code. **Noto Sans** and **Noto Serif**
are fallbacks for non-Latin scripts. All are on Google Fonts.
Plus Jakarta Sans is a variable font (200–800), and the system
uses 500, 600, and 700.

| Token | Size / line height | Default weight | CSS variable |
| --- | --- | --- | --- |
| Heading xxlarge (h1) | 32px / 40px | 700 | `--wb-font-heading-size-xxlarge` |
| Heading xlarge (h2) | 24px / 32px | 700 | `--wb-font-heading-size-xlarge` |
| Heading large (h3) | 20px / 28px | 700 | `--wb-font-heading-size-large` |
| Heading medium (h4) | 18px / 24px | 700 | `--wb-font-heading-size-medium` |
| Heading small (h4) | 16px / 20px | 700 | `--wb-font-heading-size-small` |
| Body medium | 16px / 24px | 500 | `--wb-font-body-size-medium` |
| Body small | 14px / 18px | 500 | `--wb-font-body-size-small` |
| Body xsmall | 12px / 16px | 500 | `--wb-font-body-size-xsmall` |

Line heights use the matching `…-lineHeight-…` variable. Weights:
`--wb-font-weight-medium` 500,
`--wb-font-weight-semi` 600, and
`--wb-font-weight-bold` 700. Headings may use semi or
medium for a softer hierarchy.

Text style: sentence case for headings, buttons, and labels (not Title Case,
not ALL CAPS). Use tabular figures (`font-variant-numeric: tabular-nums`) for
stats and tables. Line length on screens should stay around 60–75 characters.

## Layout

- **Spacing grid is 4px.** It's tokenized as `--wb-sizing-size_NNN`, where NNN/10 is the px value. Common steps are 4, 8, 12, 16, 24, 32, 48, 64, and 96px. Use 8px between related items, 16px inside components, 24–32px between groups, and 48–96px between page sections.
- **Group by proximity first.** Space separates sections before borders or background color does.
- **Logical properties** (`margin-inline-start`, etc.) keep layouts RTL-safe. KA ships in RTL languages.
- Medium-specific grids (screen breakpoints, slide canvas) are in the output guides.

## Elevation & Depth

Depth is mostly **flat**. Hierarchy comes from surface color (a
`base-subtle` page under `base-default` cards) and borders. Shadows are
reserved for things that lift or float.

| Token | Value (thunderblocks) | Value (syl-dark) | Use |
| --- | --- | --- | --- |
| `--wb-boxShadow-low` | `0 2px 2px 0 color-mix(in srgb, #252368 20%, transparent)` | `0 2px 2px 0 rgba(21,21,33,0.60)` | A resting card that should lift (on top of its border) |
| `--wb-boxShadow-mid` | `0 4px 8px 0 color-mix(in srgb, #252368 20%, transparent)` | `0 4px 8px 0 rgba(21,21,33,0.60)` | Popovers, dropdowns, tooltips |
| `--wb-boxShadow-high` | `0 8px 16px 0 color-mix(in srgb, #252368 20%, transparent)` | `0 8px 16px 0 rgba(21,21,33,0.60)` | Modals, dialogs |

Light-theme shadows are indigo-tinted, not gray.

**Cards.** A card is a `base-default` surface with a
1px `#CBCBCD`
border that's always present. A card that should lift adds `boxShadow.low`
*on top of* the border; it never replaces it. Cards don't nest.

**Chonky shadow.** Learner-facing buttons and tiles use a solid, unblurred
offset shadow in the darker step of their fill, for example `0 6px 0 0
#363498` under a
`#5753FA` button. The shadow
grows to 8px on hover and drops to 0 on press, so the element seems to sink
into it. The offsets (6 / 8 / 0px) aren't tokens; they come from
`ActivityButton`. This is the signature tactile detail of SYL.

## Shapes

| Token | Value | Use |
| --- | --- | --- |
| `--wb-border-radius-radius_040` | 4px | Small chips, inline tags |
| `--wb-border-radius-radius_080` | 8px | Buttons, inputs, banners, badges, cards |
| `--wb-border-radius-radius_120` | 12px | Large cards, tiles, modals, pressed buttons |
| `--wb-border-radius-radius_240` | 24px | Large panels, hero cards, slide frames |
| `--wb-border-radius-radius_full` | 50% | Avatars, icon buttons, pills |

Border widths are `--wb-border-width-thin` 1px
(default), `--wb-border-width-medium` 2px
(emphasis, selected, errors), and `--wb-border-width-thick`
4px (rare accents).

## Components

The front matter describes the core component looks: primary, secondary, and
tertiary buttons, a card, a text input, and an info banner. Two rules hold in
every medium:

- **One primary per view.** Pair a single filled primary with secondary or tertiary actions. A secondary button also has a 1px `#BFCAFF` border.
- **Focus is always visible.** Every interactive element shows a focus ring on `:focus-visible`: a 2px `#5753FA` outline with a 2px `#FFFFFF` gap between it and the element.

Detailed CSS recipes are in the
[web prototype guide](https://khan.github.io/design-system-guidelines/design-md/outputs/web-prototype.md).
In React, use the actual Wonder Blocks components
([product UI guide](https://khan.github.io/design-system-guidelines/design-md/outputs/product-ui.md)).

## Iconography

- **Phosphor Icons** (`@phosphor-icons/core`) in `regular` weight by default, `bold` at small sizes or for emphasis, and `fill` for selected states.
- Sizes are 16px (small, the default), 24px (medium), 48px (large), and 96px (xlarge).
- Icons inherit `currentColor`. Color them with a foreground token.
- Mirror directional icons (arrows, carets) in RTL.
- Icons beside text are decorative (`aria-hidden`). Icon-only buttons need an accessible label.

## Illustration & characters

- Built entirely from **flat geometric shapes**: no gradients, drop shadows, textures, or 3D.
- Colors come from the graphics palette above.
- Saturation scales with audience: high for learners, moderate for teachers and admins.
- **Khanmigo**, the AI tutor, has a hexagon body. Don't redraw or improvise Khanmigo, the Khan Academy logo, or other brand marks. Use official assets, or leave a labeled placeholder and say so.
- Meaningful illustration needs 3:1 contrast. Decorative accents such as confetti and floating shapes don't.

## Motion

Motion explains change, and it's subtle by default. Honor
`prefers-reduced-motion`. These values are provisional and not yet in the
tokens package:

- **Durations:** 100ms (press), 150ms (fade/exit), 200ms (expand, popover enter), 300ms (panels, indicators).
- **Easing:** standard `cubic-bezier(.4,0,.2,1)`. Use enter `cubic-bezier(.05,.7,.1,1)` and exit `cubic-bezier(.3,0,.8,.15)`.
- **Floating elements** enter from opacity 0 with a 12px offset.

## Do's and Don'ts

**Do**

- Use `thunderblocks` and `syl-dark` values.
- Choose colors by semantic role, and keep indigo rare.
- Use Plus Jakarta Sans, sentence case, and generous whitespace on a 4px grid.
- Keep illustration flat and geometric, sourced from the graphics palette.
- Meet AA contrast, and pair color with text or icons.
- Use `:focus-visible` outlines and support keyboard and RTL.

**Don't**

- Don't use `default`/Classic values (Lato, `#1865F2`, `#21242C`) for new work.
- Don't use more than one filled primary per view, or rainbow UI chrome.
- Don't use gradients, glassmorphism, neon, heavy gray drop shadows, or 3D illustration.
- Don't use Title Case or ALL CAPS headings, or more than two font weights in one block of text.
- Don't redraw KA or Khanmigo brand marks.
- Don't use red or green purely as decoration. They mean error and success.

## Going deeper

None of this is required for decks or diagrams.

**Token source of truth** ([Khan/wonder-blocks](https://github.com/Khan/wonder-blocks))

- [`theme/thunderblocks.ts`](https://github.com/Khan/wonder-blocks/blob/main/packages/wonder-blocks-tokens/src/theme/thunderblocks.ts) and [`theme/syl-dark.ts`](https://github.com/Khan/wonder-blocks/blob/main/packages/wonder-blocks-tokens/src/theme/syl-dark.ts): the theme definitions. `syl-dark` merges on top of `thunderblocks`.
- [`semantic-color-thunderblocks.ts`](https://github.com/Khan/wonder-blocks/blob/main/packages/wonder-blocks-tokens/src/theme/semantic/semantic-color-thunderblocks.ts): role-to-color mapping.
- [`primitive-color-thunderblocks.ts`](https://github.com/Khan/wonder-blocks/blob/main/packages/wonder-blocks-tokens/src/theme/semantic/internal/primitive-color-thunderblocks.ts): the full primitive ramp.
- [`wonder-blocks-theming`](https://github.com/Khan/wonder-blocks/tree/main/packages/wonder-blocks-theming): `ThemeSwitcher`, `data-wb-theme`, `mergeTheme`.

**Design guidelines (principles, usage, patterns):**
<https://khan.github.io/design-system-guidelines/>. The `design-guidelines`
Storybook MCP serves the same pages to agents (`docs-list`, `docs-show`).

**Published Wonder Blocks Storybook:** <https://khan.github.io/wonder-blocks/>
(theme toolbar: "Shape Your Learning").

**Voice and copy:** the `ka-brand-voice` skill, for anything with words a
learner, teacher, or parent will read.
