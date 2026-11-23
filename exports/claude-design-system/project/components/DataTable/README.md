# DataTable

A table of each student, class or assignment with exact values, status badges, flags and a row menu.

**A pattern, not a Wonder Blocks component.** Wonder Blocks has no component for this yet,
so build it from the WB parts below, the way this card's preview does. The design
guidelines linked at the end define it; the preview follows the DSG's own example.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the parts:

```js
const { Badge, StatusBadge, NeutralBadge, DueBadge, GemBadge, StreakBadge } = await wb("badge");
const { PhosphorIcon } = await wb("icon");
const { SingleSelect, MultiSelect, OptionItem, ActionMenu, ActionItem, SeparatorItem } = await wb("dropdown");
const { Heading, BodyText, BodyMonospace } = await wb("typography");
const { default: IconButton, ActivityIconButton } = await wb("icon-button");
```

## When to use it

- "Who exactly, and what do I do?": find or act on individuals or items, or compare exact values across columns.
- Not for one headline number (SummaryCards) or a pattern or trend (a chart).

## Get these right

- A real `<table>` with `<th scope="col">` headers, styled with WB tokens. The column readers scan by (usually the name) comes first; names are "First Last", sorted A to Z.
- Left-align text columns; right-align numeric columns and their headers. Show `—` for missing values.
- In-cell progress: the ProgressBar's SINGLE color with the value as text beside it ("16/20").
- Flags are StatusBadges with an icon and words: `critical` (warning-octagon) when something already went wrong, `warning` (warning) when someone may need help. Up to two per cell, most severe first; never a bare "3×".
- Row actions in an ActionMenu at the end of the row, opened by a tertiary "dots-three" IconButton labeled with the row: "Actions for Amelia Abalos". Up to 50 rows, then paginate.

## Values

Read from the DSG's example source at build time
([`ProgressExamples.tsx`](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/assets/progress-charts/ProgressExamples.tsx)), so they match the docs.
Use these exact values; the preview declares them the same way.

| Constant | Value | Note |
| --- | --- | --- |
| `SINGLE` | `{fill: "#8DA2FF",outline: "#6C82FF"}` | Bar colors are primitives (Blue 50/40 for Progress and amounts, Gray 40/20 for behind schedule, Gray 10 for the target marker) until data visualization semantic tokens exist in Wonder Blocks. See the Color TODO in the Data visualization foundation. |

## Props

Each part's props are in its package's types; section 3 of the Claude artifact guide says where.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Data tables: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/data-tables.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-data-tables--docs)
- Badges: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/badges.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-feedback-badges--docs)
