# Slide decks

Read this together with the core
[DESIGN.md](https://khan.github.io/design-system-guidelines/design-md/DESIGN.md).
It covers presentation decks in any tool (Google Slides, PowerPoint, Keynote,
HTML). Decks usually can't load CSS, so use the hex and px values below.

> **Draft:** pending design review. Display sizes, the slide grid, and the
> layouts in this guide are new; they extend the product system and haven't
> been signed off by design yet.

## Canvas and grid

- **16:9 canvas, 1920×1080** (scale proportionally for other sizes).
- **96px outer margins** on all sides, which leaves a 1728×888 content area.
- **12-column grid with 24px gutters** (columns are 122px wide). Cards and text blocks snap to columns.
- Put **one idea on each slide**: a large heading plus at most 3–5 short supporting lines.

## Type on slides

The product type scale tops out at {{tb:font.heading.size.xxlarge}}. Slides
extend it with display sizes. These aren't tokens.

| Role | Size / line height | Weight |
| --- | --- | --- |
| Hero (title slide, big number) | 96 / 104px | 800 |
| Display (statement) | 64 / 72px | {{tb:font.weight.bold}} |
| Slide title | 48 / 56px | {{tb:font.weight.bold}} |
| Card title | 40 / 48px or 32 / 40px | {{tb:font.weight.bold}} |
| Body | 24–28px, line height 1.4 | {{tb:font.weight.medium}} |
| Caption / source | 20px | {{tb:font.weight.medium}} |

Use `letter-spacing: -0.01em` to `-0.02em` on display sizes, and tabular
figures for numbers. Font: {{tb:font.family.sans | first}}, sentence case.

## Surfaces and elevation

Slides use the same surface model as product UI: a quiet canvas with content
on cards.

| Element | thunderblocks | syl-dark | Notes |
| --- | --- | --- | --- |
| Canvas | `{{tb:semanticColor.core.background.base.subtle}}` | `{{dark:semanticColor.core.background.base.subtle}}` | `core-background-base-subtle` |
| Card fill | `{{tb:semanticColor.core.background.base.default}}` | `{{dark:semanticColor.core.background.base.default}}` | `core-background-base-default` |
| Card border | {{tb:border.width.thin}} `{{tb:semanticColor.core.border.neutral.subtle}}` (2px when exporting at 1920 wide) | `{{dark:semanticColor.core.border.neutral.subtle}}` | Always present |
| Card lift | `{{tb:boxShadow.low}}`, scaled ×2 | `{{dark:boxShadow.low}}`, scaled ×2 | One card per slide at most, on top of the border |
| Card radius | {{tb:border.radius.radius_240}} | same | `radius_240`, the slide-frame radius |
| Card padding | {{tb:sizing.size_480}} | same | Use {{tb:sizing.size_320}} in dense cards |
| Text | `{{tb:semanticColor.core.foreground.neutral.strong}}` / secondary `{{tb:semanticColor.core.foreground.neutral.default}}` | `{{dark:semanticColor.core.foreground.neutral.strong}}` / `{{dark:semanticColor.core.foreground.neutral.default}}` | |
| Accent | `{{tb:semanticColor.core.background.instructive.default}}` | `{{dark:semanticColor.core.background.instructive.default}}` | One filled indigo element per slide |

Rules:

- **At most one elevated card per slide.** The lift says "this is the point."
- **Cards never nest.** Group inside a card with spacing, not another card.
- `boxShadow.mid` and `boxShadow.high` are never used on slides: nothing floats.
- **Text never sits directly on accent shapes.** Geometric accents from the graphics palette sit in corners and behind cards, never behind text.
- Gutters between cards are 24px, from the grid.
- For a dark deck or a dark band, switch the whole slide to the `syl-dark` column; the card rules stay the same.

## Layouts

Each layout names the one element that carries the indigo accent.

### 1. Title

```
┌──────────────────────────────────────────────┐
│                                         ◆ ●  │
│                                           ▲  │
│  Hero title (96px, 2 lines max)              │
│  Subtitle (28px, secondary)                  │
│                                              │
│  Presenter · date (20px, subtle)             │
└──────────────────────────────────────────────┘
```

- Full-bleed `{{tb:semanticColor.core.background.base.default}}` canvas. **No cards.**
- Title spans columns 1–8. Geometric accent shapes (graphics palette) cluster in the top-right corner, clear of the text.
- **Accent:** one indigo shape in the cluster.

### 2. Section divider

```
┌──────────────────────────────────────────────┐
│██████████████████████████████████████████████│
│██  02                                      ██│
│██  Section title (64px, knockout)          ██│
│██████████████████████████████████████████████│
└──────────────────────────────────────────────┘
```

- Full-bleed `{{tb:semanticColor.core.background.instructive.default}}` (or `{{tb:semanticColor.core.background.base.strong}}`) fill with `{{tb:semanticColor.core.foreground.knockout.default}}` text. **No cards.**
- **Accent:** the fill itself. Use dividers sparingly; they're the loudest slide in the deck.

### 3. Statement / key idea

```
┌──────────────────────────────────────────────┐
│        ┌──────────────────────────────┐      │
│        │  One big idea (64px)          │      │
│        │  1–2 supporting lines (28px)  │      │
│        └──────────────────────────────┘      │
└──────────────────────────────────────────────┘
          (card spans columns 3–10, lifted)
```

- One centered card on the canvas, spanning columns 3–10. **This card gets `boxShadow.low`.**
- **Accent:** a single indigo word, underline, or small shape inside the card. Don't fill the card.

### 4. Two-column

```
┌──────────────────────────────────────────────┐
│  Slide title (48px)                          │
│  ┌───────────────────┐ ┌───────────────────┐ │
│  │ Card title         │ │ Card title         │ │
│  │ • point            │ │ • point            │ │
│  │ • point            │ │ • point            │ │
│  └───────────────────┘ └───────────────────┘ │
└──────────────────────────────────────────────┘
```

- Two equal cards (6 + 6 columns), each with a card title and up to 3 bullets. For comparisons and before/after.
- Neither card is lifted, unless one is the recommendation. Then lift that one.
- **Accent:** the recommended card's title or a small indigo badge on it.

### 5. Three-up cards

```
┌──────────────────────────────────────────────┐
│  Slide title (48px)                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐│
│  │ ◎ icon      │ │ ◎ icon      │ │ ◎ icon      ││
│  │ Short title │ │ Short title │ │ Short title ││
│  │ One line    │ │ One line    │ │ One line    ││
│  └────────────┘ └────────────┘ └────────────┘│
└──────────────────────────────────────────────┘
```

- Three cards (4 + 4 + 4), each with a 48px Phosphor icon, a short title, and one line.
- Use intent-subtle backgrounds (`core-background-<intent>-subtle`) only when the cards *mean* success, warning, or critical, and pair them with an icon or label.
- **Accent:** icons in `{{tb:semanticColor.core.foreground.instructive.default}}`; card fills stay neutral.

### 6. Big number / stats

```
┌──────────────────────────────────────────────┐
│  Slide title (48px)                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 96px num  │ │ 96px num  │ │ 96px num  │      │
│  │ label     │ │ label     │ │ label     │      │
│  │ ▲ +12%    │ │           │ │           │      │
│  └──────────┘ └──────────┘ └──────────┘      │
└──────────────────────────────────────────────┘
```

- 2–4 stat cards in equal columns, each with a hero-size number (tabular figures), a label, and an optional delta badge.
- One card may be the **focal stat**: an indigo-filled card (`{{tb:semanticColor.core.background.instructive.default}}`) with knockout text. That's the slide's one accent, so no other card is lifted.
- Deltas use success or critical colors with an arrow icon, never color alone.

### 7. Chart + takeaway

```
┌──────────────────────────────────────────────┐
│  Slide title (48px)                          │
│  ┌──────────────────────────┐ ┌────────────┐ │
│  │                          │ │ Takeaway    │ │
│  │   chart                  │ │ (32px)      │ │
│  │                          │ │ 2–3 lines   │ │
│  └──────────────────────────┘ └────────────┘ │
└──────────────────────────────────────────────┘
```

- A chart card (8 columns) and a takeaway card (4 columns). Lift the takeaway card.
- The chart follows the [diagrams and data viz guide](https://khan.github.io/design-system-guidelines/design-md/outputs/diagrams-and-data-viz.md): direct labels instead of legends, categorical order.
- **Accent:** the highlighted series in the chart is the indigo; other series are muted.

### 8. Quote / testimonial

```
┌──────────────────────────────────────────────┐
│     ┌────────────────────────────────────┐   │
│     │  “Large quote, 40px, 3 lines max.” │   │
│     │                                    │   │
│     │  (●) Name, role (20px, subtle)     │   │
│     └────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

- One card (columns 2–11) with a large quote and attribution in `{{tb:semanticColor.core.foreground.neutral.subtle}}`.
- Optional avatar circle (`radius_full`). Use a real photo or a labeled placeholder; don't draw a face.
- **Accent:** a large indigo opening quotation mark.

## Charts and diagrams on slides

Follow the
[diagrams and data viz guide](https://khan.github.io/design-system-guidelines/design-md/outputs/diagrams-and-data-viz.md),
scaling strokes and labels up for the 1920 canvas (2–3px strokes, 20px+ labels).
