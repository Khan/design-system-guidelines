This design system tells an agent how to make anything look like Khan
Academy: a Claude artifact or prototype, a slide deck, a diagram, a one-pager,
or production UI. This README holds the rules that apply to every output. Read
it, then the one section for what you're making (see
[What are you making?](#what-are-you-making)). Together they're complete.

Token values come from the Wonder Blocks
[tokens source](https://github.com/Khan/wonder-blocks/tree/main/packages/wonder-blocks-tokens/src/theme)
(currently `@khanacademy/wonder-blocks-tokens@18.0.0`), which
wins if anything here disagrees.

**Build with the real components.** For a prototype, a page, or a Claude
artifact, use the real Wonder Blocks React components, loaded from jsDelivr
the way the [Claude artifact guide](claude-artifact.md) shows. Every
component card in this system is built that way. Never re-create a component
from tokens and CSS. This system has no component bundle and no
`window.WonderBlocks` global; the guide's page skeleton is how you load them.

**Patterns Wonder Blocks doesn't have yet.** Progress bars, charts, chart
containers, summary cards and data tables have no WB component. Their cards
under Data visualization are patterns: build them from WB parts the way the
card does, with the values it gives, which come from the design guidelines'
own examples. Never invent their colors or sizes.

**Change it in the repo, not here.** This system is generated from
[Khan/design-system-guidelines](https://github.com/Khan/design-system-guidelines)
(`exports/src/`, the same source as Khan Academy's public DESIGN.md) and
published from there. Anything changed on this page is overwritten by the next
publish. To change a rule, a token note or a component card, edit the repo and
open a pull request.

## What are you making?

| If you're making… | Also read |
| --- | --- |
| Prototype, page, or Claude artifact | The [Claude artifact guide](claude-artifact.md). Build with the real Wonder Blocks components it loads; never rebuild them from tokens. For progress bars, charts and tables, follow the pattern cards under Data visualization |
| One specific component | Its card under Components: when to use it, its import line, the rules that are easy to get wrong, and where its props live |
| Product UI in a Wonder Blocks codebase | [product-ui.md](product-ui.md) |
| Plain HTML page or prototype without React | [web-prototype.md](web-prototype.md) |
| Slide deck | [slides.md](slides.md) |
| Diagram or flowchart | [diagrams.md](diagrams.md) |
| Chart, stat card, data table, or data report | The pages linked from [Charts and data visualization](#charts-and-data-visualization) below |
| Something else | This file plus the closest guide. State your assumptions. |

Guides may extend this file but never override it. Each value has one home: when a guide points to another guide for something (slides point to the diagrams guide for diagram colors), that guide wins.

### Charts and data visualization

Chart guidance isn't in this file. It lives in the design guidelines, and those pages win over anything here, including the graphics palette. Read them before you make a chart, a stat card, a data table, or a data report, in any medium. Each "Source" link is the page's Markdown (with some JSX; color swatches carry their hex values), and each "Page" link is the rendered page for people. If you can't fetch them, say so instead of guessing chart colors.

| Read | For | Source | Page |
| --- | --- | --- | --- |
| Data visualization (foundation) | Principles, choosing a chart, forms to avoid, anatomy, color roles, number formatting, chart titles, accessibility | [data-visualization.mdx](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-foundations/data-visualization.mdx) | [Data visualization](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-foundations-data-visualization--docs) |
| Data reports (pattern) | Which component answers which question; number, chart, or table; showing growth; page order; empty and error states | [data-reports.mdx](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-patterns/data-reports.mdx) | [Data reports](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-patterns-data-reports--docs) |
| Chart container | Headings, sizes, and controls around a chart | [chart-container.mdx](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/chart-container.mdx) | [Chart container](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-chart-container--docs) |
| Summary cards | Headline numbers, like a stat card | [summary-cards.mdx](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/summary-cards.mdx) | [Summary cards](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-summary-cards--docs) |
| Progress charts | A current value against a goal | [progress-charts.mdx](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/progress-charts.mdx) | [Progress charts](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-progress-charts--docs) |
| Distribution charts | How a group is spread across ranges or levels | [distribution-charts.mdx](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/distribution-charts.mdx) | [Distribution charts](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-distribution-charts--docs) |
| Trend charts | A value across three or more periods | [trend-charts.mdx](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/trend-charts.mdx) | [Trend charts](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-trend-charts--docs) |
| Data tables | Exact values for each person or item | [data-tables.mdx](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/data-tables.mdx) | [Data tables](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-data-tables--docs) |

Links inside those pages look like `./?path=/docs/<id>`. They point to other pages on the same site, and the Storybook MCP (`docs-show`) takes the same ids.

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
- **This system's token pages.** Colors, Typography, Spacing, Radius, Shadows and Border width list the tokens in both themes, named without the `--wb-` and `--wb-semanticColor-` prefixes (`core-background-base-default`). Each note names the real CSS variable: use that variable in code, never the hex.
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

### Graphics palette (illustration, diagrams, decks)

Illustration and expressive graphics use these categorical hues, never
arbitrary hex values (`graphics-characters-flesh-<hue>-background-<step>`).
Charts don't: their colors come from the data visualization color roles (see
[Charts and data visualization](#charts-and-data-visualization)).

| Hue | Subtle | Default | Strong | Typical use |
| --- | --- | --- | --- | --- |
| Blue (indigo) | `#6C82FF` | `#5753FA` | `#4340D0` | Brand |
| Cyan | `#57BAFD` | `#28A9FF` | `#2485C7` | Admin role |
| Green | `#72BB82` | `#579F6C` | `#3C6D4A` | Growth, completion, parent role |
| Magenta | `#F670C1` | `#E83FA4` | `#BB3183` | Gems, motivation, celebration |
| Orange | `#F97B4F` | `#F8551A` | `#C8481A` | Streaks, energy, learner role |
| Yellow | `#FCC539` | `#FCB706` | `#D69900` | Attempted / in progress, teacher role |

Yellow has no character token, so its row uses the same primitive steps
(yellow 40/30/20) and isn't generated. Each hue also has light tints for
fills, the primitive 60–90 steps, which aren't published as CSS variables:
blue `#DFEAFF`, cyan `#CCE9FE`, green `#D5F3D5`, magenta `#FAD4EC`, orange
`#FEDFD8`, yellow `#FEEAB8`.

**Learning states** (`learning-<background|foreground>-progress-<state>-…`).
These colors are for learner-facing progress, such as progress nodes and
bars. They aren't for text, or for charts in data reports:

| State | Fill | Icon / mark |
| --- | --- | --- |
| Not started | `#CBCBCD` | `#4A4C53` |
| Attempted | `#FEE7AD` | `#966B00` |
| Complete | `#BCEBBB` | `#2C5037` |

These are the colors of the progress icons in the
[asset catalog](asset-catalog.md#progress): circle = fill, glyph = icon / mark,
with a darker edge (`learning-shadow-progress-<state>-default`). Use the icon
files instead of drawing state marks.

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
[web prototype guide](web-prototype.md).
In React, use the actual Wonder Blocks components
([product UI guide](product-ui.md), or the
[Claude artifact guide](claude-artifact.md) for artifacts).

## Iconography

- **Phosphor Icons** (`@phosphor-icons/core`) in `regular` weight by default, `bold` at small sizes or for emphasis, and `fill` for selected states.
- Sizes are 16px (small, the default), 24px (medium), 48px (large), and 96px (xlarge).
- Icons inherit `currentColor`. Color them with a foreground token.
- Mirror directional icons (arrows, carets) in RTL.
- Icons beside text are decorative (`aria-hidden`). Icon-only buttons need an accessible label.

### Khan Academy icons

Phosphor is for UI glyphs such as arrows, close, and settings. When you show a
Khan Academy concept, use the official file from the
[asset catalog](asset-catalog.md) instead. Never use a Phosphor lookalike, and
never draw one.

- **Activities and progress** (video, article, quiz, unit test; attempted, familiar, proficient, mastery) are circled icons: the glyph sits in a circle with a solid bottom edge, and the circle's color is the learning state. A content type the learner hasn't started is a gray circled icon from `icons/activities/`. Once they've started it, show a mastery-level circled icon from `icons/progress/` instead. Use the circled icon whole; don't take the glyph out or redraw the circle.
- **Motivation** icons (gem, streak) are standalone multicolor glyphs, without a circle.
- Fetch the file and inline its SVG markup, or copy it into your project. Circled icons are 50px wide (55px tall with the edge), and gem and streak are 56px. Scale evenly.
- **Dark theme:** the files use `thunderblocks` colors, and every circled-icon color is a learning-state token. On `syl-dark` surfaces, swap each hex for its dark value using the catalog's tables, all in one pass. Where CSS works, you can set the fills to the token CSS variables instead. Motivation icons don't change.
- Next to a text label, the icon is decorative (`aria-hidden="true"`). On its own, give it `role="img"` and the concept's name as its accessible name.

## Illustration & characters

- Built entirely from **flat geometric shapes**: no gradients, drop shadows, textures, or 3D.
- Colors come from the graphics palette above.
- Saturation scales with audience: high for learners, moderate for teachers and admins.
- **Khanmigo**, the AI tutor, has a hexagon body.
- Meaningful illustration needs 3:1 contrast. Decorative accents such as confetti and floating shapes don't.
- **Confetti shapes** are decorative accents for celebration moments, mostly in learner-facing work. Use the official [shape files](asset-catalog.md#confetti-shapes) instead of making up shapes. They're always `aria-hidden` and never carry meaning.

### Brand marks

Use these files. Never draw, trace, or approximate a brand mark, even as a
"simplified" version.

| Mark | File | Notes |
| --- | --- | --- |
| Khan Academy logo mark (light, `thunderblocks`) | [assets/Brand/khan-academy-logo-mark.svg](assets/Brand/khan-academy-logo-mark.svg) | Single-color hexagon, `#191918`, 40×40 |
| Khan Academy logo mark (dark, `syl-dark`) | [assets/Brand/khan-academy-logo-mark-on-dark.svg](assets/Brand/khan-academy-logo-mark-on-dark.svg) | Same mark filled with the dark default foreground, `#EDEDEE` (`core-foreground-neutral-strong`) |
| Khanmigo | [assets/Brand/khanmigo.svg](assets/Brand/khanmigo.svg) | Indigo hexagon with face, 65×71. The same file works in both themes |

- Fetch the file and inline its SVG markup, or copy it into your project. These links are relative, so resolve them against wherever you read this file.
- Pick the logo mark by theme: the light file on `thunderblocks` surfaces, the on-dark file on `syl-dark` surfaces. If one page switches themes, swap the file, or inline the SVG and set its fill to `var(--wb-semanticColor-core-foreground-neutral-strong)` so it follows the theme.
- Don't recolor, stretch, crop, rotate, outline, or add effects beyond the theme swap above. Scale only, keeping the aspect ratio.
- Add `role="img"` and an accessible name ("Khan Academy", "Khanmigo") when the mark carries meaning. Use `aria-hidden="true"` when it sits next to the same name in text.
- For any other mark (the Khan Academy wordmark, partner or third-party logos), use an official asset if you have one. Otherwise leave a labeled placeholder and say so.

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
- Don't draw brand marks, Khan Academy icons, or confetti shapes. Use the files in the [asset catalog](asset-catalog.md), or a labeled placeholder.
- Don't use red, yellow, or green as decoration, only for semantic meaning: red="critical", yellow="warning", green="success"

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

## Component cards

Each card's README has its import line, the rules that are easy to get wrong, and where its props live; read it by path before you use the component. A component without a card is still loadable: its import line is in section 2 of the [Claude artifact guide](claude-artifact.md).

| Card | Group | Read | What it's for |
| --- | --- | --- | --- |
| Button | Actions | `components/Button/README.md` | The Wonder Blocks button for every action on a page; `kind` sets its weight. |
| IconButton | Actions | `components/IconButton/README.md` | An icon-only button for compact, well-known actions such as close, settings or more. |
| ActivityButton | Actions | `components/ActivityButton/README.md` | The chonky buttons for learner activities; `ActivityIconButton` is the icon-only one for practice tools. |
| Link | Actions | `components/Link/README.md` | Inline and standalone text links that navigate. |
| Typography | Content | `components/Typography/README.md` | `Heading` and `BodyText` set every piece of text in the Wonder Blocks type scale. |
| Card | Layout | `components/Card/README.md` | A raised or outlined container that groups one piece of content. |
| Pill | Content | `components/Pill/README.md` | A small rounded label for categories, filters and counts. |
| Badge | Feedback | `components/Badge/README.md` | Short status labels; each badge pairs its color with text or an icon. |
| Banner | Feedback | `components/Banner/README.md` | A full-width message about the page or a section, with an optional action and dismiss. |
| Tooltip | Feedback | `components/Tooltip/README.md` | A short hint that appears on hover or focus of its anchor. |
| TextField | Inputs | `components/TextField/README.md` | A single-line text input, labelled and validated with `LabeledField`. |
| Checkbox | Inputs | `components/Checkbox/README.md` | Checkboxes for on/off choices and for picking several options from a short list. |
| RadioGroup | Inputs | `components/RadioGroup/README.md` | One choice from a short list, with every option visible. |
| Switch | Inputs | `components/Switch/README.md` | A toggle for a setting that takes effect immediately. |
| SingleSelect | Inputs | `components/SingleSelect/README.md` | A dropdown for choosing one option from a list; `MultiSelect` chooses several. |
| ActionMenu | Actions | `components/ActionMenu/README.md` | A menu of actions behind one button, for secondary actions on an item. |
| Modal | Overlays | `components/Modal/README.md` | `ModalLauncher` with an `OnePaneDialog` opens a focused task over the page. |
| Popover | Overlays | `components/Popover/README.md` | A small anchored panel with a title and a few lines of content. |
| Tabs | Navigation | `components/Tabs/README.md` | Switches between panels of related content in one place. |
| Accordion | Content | `components/Accordion/README.md` | Stacked sections that expand to show their content. |
| Breadcrumbs | Navigation | `components/Breadcrumbs/README.md` | Shows where a page sits in a hierarchy, with links to its ancestors. |
| DetailCell | Content | `components/DetailCell/README.md` | A list row with a title, up to two subtitles and accessories on either side. |
| SearchField | Inputs | `components/SearchField/README.md` | A text field with a search icon and a clear button. |
| CircularSpinner | Feedback | `components/CircularSpinner/README.md` | An indeterminate loading indicator. |
| ProgressBar | Data visualization | `components/ProgressBar/README.md` | A bar that shows a current value against a goal, optionally with an expected-by-today marker, in a chart container. |
| DistributionChart | Data visualization | `components/DistributionChart/README.md` | A bar chart of how many students, classes or schools land in each range, in a large chart container. |
| TrendChart | Data visualization | `components/TrendChart/README.md` | A line chart of a value across time, like average score by assessment window, in a large chart container. |
| SummaryCards | Data visualization | `components/SummaryCards/README.md` | A row of 2 to 4 stat cards with the page's headline numbers, at the top of a report. |
| DataTable | Data visualization | `components/DataTable/README.md` | A table of each student, class or assignment with exact values, status badges, flags and a row menu. |
