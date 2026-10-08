---
version: alpha
name: Khan Academy — Wonder Blocks (Shape Your Learning)
description: >-
  Visual language for Khan Academy products and materials, sourced from the
  Wonder Blocks design system. Values below are the `thunderblocks` theme
  (light). Its dark counterpart is `syl-dark`. Do NOT use the Wonder Blocks
  `default` ("Classic") theme values for new work.
colors:
  primary: "{{tb:semanticColor.core.background.instructive.default}}"
  primary-strong: "{{tb:semanticColor.core.background.instructive.strong}}"
  primary-subtle: "{{tb:semanticColor.core.background.instructive.subtle}}"
  primary-border: "{{tb:semanticColor.core.border.instructive.subtle}}"
  on-primary: "{{tb:semanticColor.core.foreground.knockout.default}}"
  background: "{{tb:semanticColor.core.background.base.default}}"
  background-subtle: "{{tb:semanticColor.core.background.base.subtle}}"
  background-strong: "{{tb:semanticColor.core.background.base.strong}}"
  neutral-subtle: "{{tb:semanticColor.core.background.neutral.subtle}}"
  text: "{{tb:semanticColor.core.foreground.neutral.strong}}"
  text-secondary: "{{tb:semanticColor.core.foreground.neutral.default}}"
  text-subtle: "{{tb:semanticColor.core.foreground.neutral.subtle}}"
  border: "{{tb:semanticColor.core.border.neutral.subtle}}"
  border-strong: "{{tb:semanticColor.core.border.neutral.strong}}"
  critical: "{{tb:semanticColor.core.background.critical.default}}"
  critical-subtle: "{{tb:semanticColor.core.background.critical.subtle}}"
  success: "{{tb:semanticColor.core.foreground.success.default}}"
  success-subtle: "{{tb:semanticColor.core.background.success.subtle}}"
  warning: "{{tb:semanticColor.core.foreground.warning.default}}"
  warning-subtle: "{{tb:semanticColor.core.background.warning.subtle}}"
  focus: "{{tb:semanticColor.focus.outer}}"
  khanmigo: "{{tb:semanticColor.khanmigo.primary}}"
  mastery: "{{tb:semanticColor.mastery.primary}}"
typography:
  heading-xxlarge: { fontFamily: "{{tb:font.family.sans | first}}", fontSize: "{{tb:font.heading.size.xxlarge}}", fontWeight: "{{tb:font.weight.bold}}", lineHeight: "{{tb:font.heading.lineHeight.xxlarge}}" }
  heading-xlarge: { fontFamily: "{{tb:font.family.sans | first}}", fontSize: "{{tb:font.heading.size.xlarge}}", fontWeight: "{{tb:font.weight.bold}}", lineHeight: "{{tb:font.heading.lineHeight.xlarge}}" }
  heading-large: { fontFamily: "{{tb:font.family.sans | first}}", fontSize: "{{tb:font.heading.size.large}}", fontWeight: "{{tb:font.weight.bold}}", lineHeight: "{{tb:font.heading.lineHeight.large}}" }
  heading-medium: { fontFamily: "{{tb:font.family.sans | first}}", fontSize: "{{tb:font.heading.size.medium}}", fontWeight: "{{tb:font.weight.bold}}", lineHeight: "{{tb:font.heading.lineHeight.medium}}" }
  heading-small: { fontFamily: "{{tb:font.family.sans | first}}", fontSize: "{{tb:font.heading.size.small}}", fontWeight: "{{tb:font.weight.bold}}", lineHeight: "{{tb:font.heading.lineHeight.small}}" }
  body-medium: { fontFamily: "{{tb:font.family.sans | first}}", fontSize: "{{tb:font.body.size.medium}}", fontWeight: "{{tb:font.weight.medium}}", lineHeight: "{{tb:font.body.lineHeight.medium}}" }
  body-small: { fontFamily: "{{tb:font.family.sans | first}}", fontSize: "{{tb:font.body.size.small}}", fontWeight: "{{tb:font.weight.medium}}", lineHeight: "{{tb:font.body.lineHeight.small}}" }
  body-xsmall: { fontFamily: "{{tb:font.family.sans | first}}", fontSize: "{{tb:font.body.size.xsmall}}", fontWeight: "{{tb:font.weight.medium}}", lineHeight: "{{tb:font.body.lineHeight.xsmall}}" }
  mono: { fontFamily: "{{tb:font.family.mono | first}}", fontSize: "{{tb:font.body.size.medium}}", fontWeight: "{{tb:font.weight.regular}}", lineHeight: "{{tb:font.body.lineHeight.medium}}" }
rounded:
  none: "{{tb:border.radius.radius_0}}"
  xs: "{{tb:border.radius.radius_040}}"
  sm: "{{tb:border.radius.radius_080}}"
  md: "{{tb:border.radius.radius_120}}"
  lg: "{{tb:border.radius.radius_240}}"
  # Not a token: WB's radius_full is 50%, which the spec can't express as a dimension.
  full: 9999px
spacing:
  "1": "{{tb:sizing.size_040}}"
  "2": "{{tb:sizing.size_080}}"
  "3": "{{tb:sizing.size_120}}"
  "4": "{{tb:sizing.size_160}}"
  "5": "{{tb:sizing.size_200}}"
  "6": "{{tb:sizing.size_240}}"
  "8": "{{tb:sizing.size_320}}"
  "10": "{{tb:sizing.size_400}}"
  "12": "{{tb:sizing.size_480}}"
  "16": "{{tb:sizing.size_640}}"
  "24": "{{tb:sizing.size_960}}"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-medium}"
    rounded: "{rounded.sm}"
    height: "{{tb:c.button.root.sizing.height.medium}}"
    padding: "0 {{tb:c.button.root.layout.padding.inline.primary.medium}}"
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
    height: "{{tb:c.button.root.sizing.height.medium}}"
    padding: "0 {{tb:c.button.root.layout.padding.inline.secondary.medium}}"
  button-tertiary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "{{tb:sizing.size_160}}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    height: "{{tb:c.form-field.sizing.height}}"
    padding: "0 {{tb:c.form-field.layout.paddingInline}}"
  banner-info:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary-strong}"
    rounded: "{rounded.sm}"
    padding: "{{tb:sizing.size_160}}"
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
(currently `@khanacademy/wonder-blocks-tokens@{{meta:tokensVersion}}`), which
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

Guides may extend this file but never override it.

## Which theme

Wonder Blocks ships three token themes. **Use `thunderblocks` (light) and
`syl-dark` (dark).** They are the current Khan Academy look, internally
called **Shape Your Learning (SYL)**.

| Theme | Use it? | What it is |
| --- | --- | --- |
| `thunderblocks` | **Yes, the default for light** | SYL brand. {{tb:font.family.sans | first}}, indigo `{{tb:semanticColor.core.background.instructive.default}}`, cool neutrals. |
| `syl-dark` | **Yes, the default for dark** | Dark counterpart of `thunderblocks`. It inherits fonts and sizes and inverts surfaces. |
| `default` | **No** | Legacy "Classic" look: Lato, blue `#1865F2`. It's only called "default" because it binds to `:root`. Don't copy its values. |

There is also a `"dark"` entry in `SupportedThemes`, but it has no tokens. Ignore it.

If you read hex values out of `@khanacademy/wonder-blocks-tokens` source, the
docs site, or `tokens/color.ts`, you'll often get `default` values. Check
which theme a value came from before you use it.

## How tokens are delivered

- **CSS variables.** Every token is a CSS custom property in one stylesheet that holds all three themes: `https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-tokens@{{meta:tokensMajor}}/dist/css/index.css`. The `data-wb-theme` attribute (`thunderblocks` or `syl-dark`) on any element picks the theme for that subtree.
- **Naming.** A variable is `--wb-` plus the token path joined with dashes. The color tables below show paths after `--wb-semanticColor-`, so `core-background-base-default` means `{{name:semanticColor.core.background.base.default}}`.
- **React.** With Wonder Blocks installed, the `semanticColor`, `font`, `sizing`, `border`, and `boxShadow` JS exports resolve to the same variables.
- **No CSS available** (PowerPoint, Keynote, Figma, an SVG file): use the hex and px values in this file.

## Overview

Khan Academy is a free, world-class education for anyone, anywhere. The
visual language has to feel **warm, capable, and encouraging**: a patient
tutor, not a game show and not an enterprise dashboard.

- **Calm surfaces, one strong signal.** White and near-white surfaces with cool gray structure. Indigo `{{tb:semanticColor.core.background.instructive.default}}` is the single action and brand color, and it carries more weight the less it appears.
- **Shapes are the brand.** Illustration is flat and geometric: hexagons, circles, rounded rectangles. No gradients, bevels, or dimensional shading. Complexity comes from composition, not surface effects.
- **Friendly, rounded, sturdy.** {{tb:border.radius.radius_080}} corners on controls and cards, and "chonky" buttons with a solid offset shadow on learner-facing surfaces.
- **Audience sets the volume.** Learner-facing work is playful and saturated, and Khanmigo is central. Teacher, admin, and parent work is more restrained: illustration is an occasional moment of warmth inside a dense layout.
- **Accessible by default.** WCAG AA contrast, and color is never the only way meaning gets across.

## Colors

Pick colors by **role**, not by appearance. If a red looks nice but the
element isn't an error or a destructive action, it's the wrong token.

### Surfaces and text

| Role | Token (`--wb-semanticColor-…`) | thunderblocks | syl-dark |
| --- | --- | --- | --- |
| Page / card background | `core-background-base-default` | `{{tb:semanticColor.core.background.base.default}}` | `{{dark:semanticColor.core.background.base.default}}` |
| Subtle page background | `core-background-base-subtle` | `{{tb:semanticColor.core.background.base.subtle}}` | `{{dark:semanticColor.core.background.base.subtle}}` |
| Inverse / strong surface | `core-background-base-strong` | `{{tb:semanticColor.core.background.base.strong}}` | `{{dark:semanticColor.core.background.base.strong}}` |
| Neutral fill (chips, wells) | `core-background-neutral-subtle` | `{{tb:semanticColor.core.background.neutral.subtle}}` | `{{dark:semanticColor.core.background.neutral.subtle}}` |
| Primary text | `core-foreground-neutral-strong` | `{{tb:semanticColor.core.foreground.neutral.strong}}` | `{{dark:semanticColor.core.foreground.neutral.strong}}` |
| Secondary text | `core-foreground-neutral-default` | `{{tb:semanticColor.core.foreground.neutral.default}}` | `{{dark:semanticColor.core.foreground.neutral.default}}` |
| Subtle text / captions | `core-foreground-neutral-subtle` | `{{tb:semanticColor.core.foreground.neutral.subtle}}` | `{{dark:semanticColor.core.foreground.neutral.subtle}}` |
| Text on filled color | `core-foreground-knockout-default` | `{{tb:semanticColor.core.foreground.knockout.default}}` | `{{dark:semanticColor.core.foreground.knockout.default}}` |
| Divider / quiet border | `core-border-neutral-subtle` | `{{tb:semanticColor.core.border.neutral.subtle}}` | `{{dark:semanticColor.core.border.neutral.subtle}}` |
| Control border | `core-border-neutral-default` | `{{tb:semanticColor.core.border.neutral.default}}` | `{{dark:semanticColor.core.border.neutral.default}}` |
| Strong border | `core-border-neutral-strong` | `{{tb:semanticColor.core.border.neutral.strong}}` | `{{dark:semanticColor.core.border.neutral.strong}}` |
| Modal scrim | `core-background-overlay-default` | `{{tb:semanticColor.core.background.overlay.default}}` | `{{dark:semanticColor.core.background.overlay.default}}` |

### Intent colors

Each intent comes in subtle, default, and strong steps for background,
foreground, and border (`core-<background|foreground|border>-<intent>-<step>`).
"Instructive" is the brand/primary intent. **For text on a subtle background,
use the strong foreground.** The default foregrounds of warning and neutral
fall below 4.5:1 on their subtle backgrounds.

**thunderblocks**

| Intent | Background subtle / default / strong | Foreground default / strong | Border subtle / default |
| --- | --- | --- | --- |
| Instructive (brand) | `{{tb:semanticColor.core.background.instructive.subtle}}` / `{{tb:semanticColor.core.background.instructive.default}}` / `{{tb:semanticColor.core.background.instructive.strong}}` | `{{tb:semanticColor.core.foreground.instructive.default}}` / `{{tb:semanticColor.core.foreground.instructive.strong}}` | `{{tb:semanticColor.core.border.instructive.subtle}}` / `{{tb:semanticColor.core.border.instructive.default}}` |
| Success | `{{tb:semanticColor.core.background.success.subtle}}` / `{{tb:semanticColor.core.background.success.default}}` / `{{tb:semanticColor.core.background.success.strong}}` | `{{tb:semanticColor.core.foreground.success.default}}` / `{{tb:semanticColor.core.foreground.success.strong}}` | `{{tb:semanticColor.core.border.success.subtle}}` / `{{tb:semanticColor.core.border.success.default}}` |
| Warning | `{{tb:semanticColor.core.background.warning.subtle}}` / `{{tb:semanticColor.core.background.warning.default}}` / `{{tb:semanticColor.core.background.warning.strong}}` | `{{tb:semanticColor.core.foreground.warning.default}}` / `{{tb:semanticColor.core.foreground.warning.strong}}` | `{{tb:semanticColor.core.border.warning.subtle}}` / `{{tb:semanticColor.core.border.warning.default}}` |
| Critical | `{{tb:semanticColor.core.background.critical.subtle}}` / `{{tb:semanticColor.core.background.critical.default}}` / `{{tb:semanticColor.core.background.critical.strong}}` | `{{tb:semanticColor.core.foreground.critical.default}}` / `{{tb:semanticColor.core.foreground.critical.strong}}` | `{{tb:semanticColor.core.border.critical.subtle}}` / `{{tb:semanticColor.core.border.critical.default}}` |
| Neutral | `{{tb:semanticColor.core.background.neutral.subtle}}` / `{{tb:semanticColor.core.background.neutral.default}}` / `{{tb:semanticColor.core.background.neutral.strong}}` | `{{tb:semanticColor.core.foreground.neutral.default}}` / `{{tb:semanticColor.core.foreground.neutral.strong}}` | `{{tb:semanticColor.core.border.neutral.subtle}}` / `{{tb:semanticColor.core.border.neutral.default}}` |

**syl-dark**

| Intent | Background subtle / default / strong | Foreground default / strong | Border subtle / default |
| --- | --- | --- | --- |
| Instructive (brand) | `{{dark:semanticColor.core.background.instructive.subtle}}` / `{{dark:semanticColor.core.background.instructive.default}}` / `{{dark:semanticColor.core.background.instructive.strong}}` | `{{dark:semanticColor.core.foreground.instructive.default}}` / `{{dark:semanticColor.core.foreground.instructive.strong}}` | `{{dark:semanticColor.core.border.instructive.subtle}}` / `{{dark:semanticColor.core.border.instructive.default}}` |
| Success | `{{dark:semanticColor.core.background.success.subtle}}` / `{{dark:semanticColor.core.background.success.default}}` / `{{dark:semanticColor.core.background.success.strong}}` | `{{dark:semanticColor.core.foreground.success.default}}` / `{{dark:semanticColor.core.foreground.success.strong}}` | `{{dark:semanticColor.core.border.success.subtle}}` / `{{dark:semanticColor.core.border.success.default}}` |
| Warning | `{{dark:semanticColor.core.background.warning.subtle}}` / `{{dark:semanticColor.core.background.warning.default}}` / `{{dark:semanticColor.core.background.warning.strong}}` | `{{dark:semanticColor.core.foreground.warning.default}}` / `{{dark:semanticColor.core.foreground.warning.strong}}` | `{{dark:semanticColor.core.border.warning.subtle}}` / `{{dark:semanticColor.core.border.warning.default}}` |
| Critical | `{{dark:semanticColor.core.background.critical.subtle}}` / `{{dark:semanticColor.core.background.critical.default}}` / `{{dark:semanticColor.core.background.critical.strong}}` | `{{dark:semanticColor.core.foreground.critical.default}}` / `{{dark:semanticColor.core.foreground.critical.strong}}` | `{{dark:semanticColor.core.border.critical.subtle}}` / `{{dark:semanticColor.core.border.critical.default}}` |
| Neutral | `{{dark:semanticColor.core.background.neutral.subtle}}` / `{{dark:semanticColor.core.background.neutral.default}}` / `{{dark:semanticColor.core.background.neutral.strong}}` | `{{dark:semanticColor.core.foreground.neutral.default}}` / `{{dark:semanticColor.core.foreground.neutral.strong}}` | `{{dark:semanticColor.core.border.neutral.subtle}}` / `{{dark:semanticColor.core.border.neutral.default}}` |

### Fixed brand colors (same in every theme)

| Role | Token | Value |
| --- | --- | --- |
| Khanmigo (AI tutor) primary | `khanmigo-primary` | `{{tb:semanticColor.khanmigo.primary}}` |
| Khanmigo secondary | `khanmigo-secondary` | `{{tb:semanticColor.khanmigo.secondary}}` |
| Mastery | `mastery-primary` | `{{tb:semanticColor.mastery.primary}}` |
| Focus ring (outer) | `focus-outer` | `{{tb:semanticColor.focus.outer}}` |

### Graphics palette (illustration, data viz, diagrams, decks)

Illustration and expressive graphics use these categorical hues, never
arbitrary hex values (`graphics-characters-flesh-<hue>-background-<step>`):

| Hue | Subtle | Default | Strong | Typical use |
| --- | --- | --- | --- | --- |
| Blue (indigo) | `{{tb:semanticColor.graphics.characters.flesh.blue.background.subtle}}` | `{{tb:semanticColor.graphics.characters.flesh.blue.background.default}}` | `{{tb:semanticColor.graphics.characters.flesh.blue.background.strong}}` | Brand, primary series |
| Cyan | `{{tb:semanticColor.graphics.characters.flesh.cyan.background.subtle}}` | `{{tb:semanticColor.graphics.characters.flesh.cyan.background.default}}` | `{{tb:semanticColor.graphics.characters.flesh.cyan.background.strong}}` | Secondary series, admin role |
| Green | `{{tb:semanticColor.graphics.characters.flesh.green.background.subtle}}` | `{{tb:semanticColor.graphics.characters.flesh.green.background.default}}` | `{{tb:semanticColor.graphics.characters.flesh.green.background.strong}}` | Growth, completion, parent role |
| Magenta | `{{tb:semanticColor.graphics.characters.flesh.magenta.background.subtle}}` | `{{tb:semanticColor.graphics.characters.flesh.magenta.background.default}}` | `{{tb:semanticColor.graphics.characters.flesh.magenta.background.strong}}` | Gems, rewards, celebration |
| Orange | `{{tb:semanticColor.graphics.characters.flesh.orange.background.subtle}}` | `{{tb:semanticColor.graphics.characters.flesh.orange.background.default}}` | `{{tb:semanticColor.graphics.characters.flesh.orange.background.strong}}` | Streaks, energy, learner role |
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
| Not started | `{{tb:semanticColor.learning.background.progress.notStarted.default}}` | `{{tb:semanticColor.learning.foreground.progress.notStarted.strong}}` |
| Attempted | `{{tb:semanticColor.learning.background.progress.attempted.default}}` | `{{tb:semanticColor.learning.foreground.progress.attempted.strong}}` |
| Complete | `{{tb:semanticColor.learning.background.progress.complete.default}}` | `{{tb:semanticColor.learning.foreground.progress.complete.strong}}` |

### Color rules

- Body text is `{{tb:semanticColor.core.foreground.neutral.strong}}` on `{{tb:semanticColor.core.background.base.default}}`. Use pure black only for third-party brand marks.
- Use **one** filled indigo element per view, slide, or card: the primary action, or the one thing you want noticed.
- Text needs 4.5:1 contrast. Large text (24px and up, or 19px and up when bold), control borders, and meaningful graphics need 3:1. Strong foreground tokens pass 4.5:1 on every subtle and base background.
- Never let color carry meaning alone. Pair it with an icon, a label, weight, or a pattern.
- Don't put green next to critical red to mean good versus bad without labels.

## Typography

**{{tb:font.family.sans | first}}** for everything: headings, body, and UI.
**{{tb:font.family.mono | first}}** for code. **Noto Sans** and **Noto Serif**
are fallbacks for non-Latin scripts. All are on Google Fonts.
{{tb:font.family.sans | first}} is a variable font (200–800), and the system
uses {{tb:font.weight.medium}}, {{tb:font.weight.semi}}, and {{tb:font.weight.bold}}.

| Token | Size / line height | Default weight | CSS variable |
| --- | --- | --- | --- |
| Heading xxlarge (h1) | {{tb:font.heading.size.xxlarge}} / {{tb:font.heading.lineHeight.xxlarge}} | {{tb:font.weight.bold}} | `{{name:font.heading.size.xxlarge}}` |
| Heading xlarge (h2) | {{tb:font.heading.size.xlarge}} / {{tb:font.heading.lineHeight.xlarge}} | {{tb:font.weight.bold}} | `{{name:font.heading.size.xlarge}}` |
| Heading large (h3) | {{tb:font.heading.size.large}} / {{tb:font.heading.lineHeight.large}} | {{tb:font.weight.bold}} | `{{name:font.heading.size.large}}` |
| Heading medium (h4) | {{tb:font.heading.size.medium}} / {{tb:font.heading.lineHeight.medium}} | {{tb:font.weight.bold}} | `{{name:font.heading.size.medium}}` |
| Heading small (h4) | {{tb:font.heading.size.small}} / {{tb:font.heading.lineHeight.small}} | {{tb:font.weight.bold}} | `{{name:font.heading.size.small}}` |
| Body medium | {{tb:font.body.size.medium}} / {{tb:font.body.lineHeight.medium}} | {{tb:font.weight.medium}} | `{{name:font.body.size.medium}}` |
| Body small | {{tb:font.body.size.small}} / {{tb:font.body.lineHeight.small}} | {{tb:font.weight.medium}} | `{{name:font.body.size.small}}` |
| Body xsmall | {{tb:font.body.size.xsmall}} / {{tb:font.body.lineHeight.xsmall}} | {{tb:font.weight.medium}} | `{{name:font.body.size.xsmall}}` |

Line heights use the matching `…-lineHeight-…` variable. Weights:
`{{name:font.weight.medium}}` {{tb:font.weight.medium}},
`{{name:font.weight.semi}}` {{tb:font.weight.semi}}, and
`{{name:font.weight.bold}}` {{tb:font.weight.bold}}. Headings may use semi or
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
| `{{name:boxShadow.low}}` | `{{tb:boxShadow.low}}` | `{{dark:boxShadow.low}}` | A resting card that should lift (on top of its border) |
| `{{name:boxShadow.mid}}` | `{{tb:boxShadow.mid}}` | `{{dark:boxShadow.mid}}` | Popovers, dropdowns, tooltips |
| `{{name:boxShadow.high}}` | `{{tb:boxShadow.high}}` | `{{dark:boxShadow.high}}` | Modals, dialogs |

Light-theme shadows are indigo-tinted, not gray.

**Cards.** A card is a `base-default` surface with a
{{tb:border.width.thin}} `{{tb:semanticColor.core.border.neutral.subtle}}`
border that's always present. A card that should lift adds `boxShadow.low`
*on top of* the border; it never replaces it. Cards don't nest.

**Chonky shadow.** Learner-facing buttons and tiles use a solid, unblurred
offset shadow in the darker step of their fill, for example `0 6px 0 0
{{tb:semanticColor.core.shadow.chonky.instructive.default}}` under a
`{{tb:semanticColor.core.background.instructive.default}}` button. The shadow
grows to 8px on hover and drops to 0 on press, so the element seems to sink
into it. The offsets (6 / 8 / 0px) aren't tokens; they come from
`ActivityButton`. This is the signature tactile detail of SYL.

## Shapes

| Token | Value | Use |
| --- | --- | --- |
| `{{name:border.radius.radius_040}}` | {{tb:border.radius.radius_040}} | Small chips, inline tags |
| `{{name:border.radius.radius_080}}` | {{tb:border.radius.radius_080}} | Buttons, inputs, banners, badges, cards |
| `{{name:border.radius.radius_120}}` | {{tb:border.radius.radius_120}} | Large cards, tiles, modals, pressed buttons |
| `{{name:border.radius.radius_240}}` | {{tb:border.radius.radius_240}} | Large panels, hero cards, slide frames |
| `{{name:border.radius.radius_full}}` | {{tb:border.radius.radius_full}} | Avatars, icon buttons, pills |

Border widths are `{{name:border.width.thin}}` {{tb:border.width.thin}}
(default), `{{name:border.width.medium}}` {{tb:border.width.medium}}
(emphasis, selected, errors), and `{{name:border.width.thick}}`
{{tb:border.width.thick}} (rare accents).

## Components

The front matter describes the core component looks: primary, secondary, and
tertiary buttons, a card, a text input, and an info banner. Two rules hold in
every medium:

- **One primary per view.** Pair a single filled primary with secondary or tertiary actions. A secondary button also has a {{tb:border.width.thin}} `{{tb:semanticColor.action.secondary.progressive.default.border}}` border.
- **Focus is always visible.** Every interactive element shows a focus ring on `:focus-visible`: a {{tb:border.width.medium}} `{{tb:semanticColor.focus.outer}}` outline with a {{tb:border.width.medium}} `{{tb:semanticColor.focus.inner}}` gap between it and the element.

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
- Use {{tb:font.family.sans | first}}, sentence case, and generous whitespace on a 4px grid.
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
