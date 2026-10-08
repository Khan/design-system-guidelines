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

The product type scale tops out at 32px. Slides
extend it with display sizes. These aren't tokens.

| Role | Size / line height | Weight |
| --- | --- | --- |
| Hero (title slide, big number) | 96 / 104px | 800 (display only; extends the product weights) |
| Display (statement) | 64 / 72px | 700 |
| Slide title | 48 / 56px | 700 |
| Section number (divider) | 48 / 56px | 700 |
| Card title | 40 / 48px, or 32 / 40px in three-up and stat cards | 700 |
| Quote | 40 / 48px | 600 |
| Body | 28px on the canvas, 24px inside cards; line height 1.4 | 500 |
| Badge (recommendation, delta) | 20 / 28px | 700 |
| Caption / source | 20px | 500 |

Use `letter-spacing: -0.01em` to `-0.02em` on display sizes, and tabular
figures for numbers. Font: Plus Jakarta Sans, sentence case.

## Surfaces and elevation

Slides use the same surface model as product UI: a quiet canvas with content
on cards. **All values below are already sized for the 1920×1080 canvas**;
don't scale them again. Hex values are given because deck tools can't load
CSS.

| Element | thunderblocks | syl-dark | Notes |
| --- | --- | --- | --- |
| Canvas | `#F8F9FB` | `#151521` | `core-background-base-subtle` |
| Card fill | `#FFFFFF` | `#252531` | `core-background-base-default` |
| Card border | 2px `#CBCBCD` | 2px `#4A4C53` | Always present (the product's 1px, doubled for the canvas) |
| Card lift | `0 4px 4px 0`, color `#252368` at 20% opacity | `0 4px 4px 0`, `rgba(21,21,33,0.6)` | One card per slide at most, on top of the border. The product's `boxShadow.low` doubled; in CSS, `color-mix(in srgb, #252368 20%, transparent)` |
| Card radius | 24px | same | `radius_240`, the slide-frame radius |
| Card padding | 48px | same | Use 32px in dense cards |
| Text | `#151521` / secondary `#4A4C53` / subtle `#717279` | `#EDEDEE` / `#CBCBCD` / `#A0A1A4` | |
| Accent fill | `#5753FA` with `#FFFFFF` text | `#5753FA` with `#FFFFFF` text | Filled shapes, badges, the focal stat card, the divider. One filled indigo element per slide |
| Accent text, icons, lines | `#5753FA` | `#6C82FF` | An indigo word, icon, quotation mark, or chart series. The fill color fails 3:1 on dark cards, so use this one |

Rules:

- **At most one elevated card per slide.** The lift says "this is the point."
- **Cards never nest.** Group inside a card with spacing, not another card.
- `boxShadow.mid` and `boxShadow.high` are never used on slides: nothing floats.
- **Text never sits directly on accent shapes.** Geometric accents from the graphics palette are optional on any layout; they sit in corners and behind cards, never behind text.
- Gutters between cards are 24px, from the grid.
- For a dark deck or a dark band, switch the whole slide to the `syl-dark` column; the card rules stay the same. Graphics-palette accent shapes use the same hex values in both themes.
- **Spacing:** 48px between the slide title and the card row; content blocks are vertically centered when a slide has no title.
- **Badges** on slides are 20 / 28px weight 700, 4px / 16px padding, and a 16px radius (the product's 8px, doubled). Arrows in delta badges can be text characters (↑ ↓).

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

- Full-bleed card-fill canvas (`#FFFFFF`; dark `#252531`), the one layout that doesn't use the subtle canvas. **No cards.**
- Title spans columns 1–8. Geometric accent shapes (graphics palette) cluster in the top-right corner, clear of the text.
- **Accent:** one indigo shape in the cluster. Draw the other shapes from non-blue hues in the graphics palette.

### 2. Section divider

```
┌──────────────────────────────────────────────┐
│██████████████████████████████████████████████│
│██  02                                      ██│
│██  Section title (64px, knockout)          ██│
│██████████████████████████████████████████████│
└──────────────────────────────────────────────┘
```

- Full-bleed `#5753FA` fill with `#FFFFFF` text, in both themes. (A neutral alternative is `#151521` with `#FFFFFF` text; in dark that's `#FFFFFF` with `#151521`.) **No cards.**
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
- **Accent:** a single word, underline, or small shape in the accent text color. Don't fill the card.

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
- **Accent:** a small filled indigo badge (for example "Recommended") on the lifted card. Without a recommendation, use one word in the slide title in the accent text color instead.

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
- Icons are Phosphor (`regular` weight) at 48px. If the tool can't load them, use a labeled placeholder rather than drawing your own.
- Use intent-subtle backgrounds (`core-background-<intent>-subtle`) only when the cards *mean* success, warning, or critical, and pair them with an icon or label.
- **Accent:** icons in the accent text color; card fills stay neutral. No card is lifted.

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
- One card may be the **focal stat**: an indigo-filled card (`#5753FA`, border the same color) with all text, including labels, in `#FFFFFF`. That's the slide's one accent. It isn't lifted, and neither is any other card.
- Deltas are small badges with an arrow icon, never color alone: success is `#E3F7E3` with `#24432D` text (dark `#1A2924` / `#D5F3D5`), and critical is `#FFEBEB` with `#8E1C1C` (dark `#3B141A` / `#FBB1B1`).

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
- **Accent:** the highlighted series. All chart colors (highlight, muted series, gridlines, axes, labels) come from the diagrams and data viz guide; this guide only changes their size.

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

- One card (columns 2–11) with a large quote and attribution in `#717279`.
- The quotation mark is about 160px tall. Optional 80px avatar circle (`radius_full`). Use a real photo or a labeled placeholder; don't draw a face.
- No card is lifted.
- **Accent:** a large opening quotation mark in the accent text color.

## Charts and diagrams on slides

Follow the
[diagrams and data viz guide](https://khan.github.io/design-system-guidelines/design-md/outputs/diagrams-and-data-viz.md),
for every chart color. On the 1920 canvas, double its sizes: 4px lines, 2px gridlines, and 20px+ labels.
