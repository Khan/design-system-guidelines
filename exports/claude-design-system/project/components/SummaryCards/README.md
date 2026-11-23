# SummaryCards

A row of 2 to 4 stat cards with the page's headline numbers, at the top of a report.

**A pattern, not a Wonder Blocks component.** Wonder Blocks has no component for this yet,
so build it from the WB parts below, the way this card's preview does. The design
guidelines linked at the end define it; the preview follows the DSG's own example.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the parts:

```js
const { Heading, BodyText, BodyMonospace } = await wb("typography");
const { Badge, StatusBadge, NeutralBadge, DueBadge, GemBadge, StreakBadge } = await wb("badge");
const { default: Link } = await wb("link");
```

## When to use it

- "What's the headline?": one value per card, side by side, under a section heading like "District overview".
- Not for change over time, a spread, individual items or progress toward a goal; use the chart or table for that.

## Get these right

- Each card: a label (sentence case, 1 to 3 words), a value, and optional context. Units stay with the value: "−7 pts", not a "Growth (pts)" label.
- A change goes in a StatusBadge with only the value and arrow ("↓ 1"); the words stay outside ("subject at risk"). Warning when down or at risk, success when up.
- Cards in a row share one height and wrap to 2, then 1. No controls and no last-updated footer.
- A View link only when there's a detail view, bottom right on the context line, named with the metric: "View classes on target". The card itself isn't a link.
- No data yet: "—" as the value and "No data yet" as the context.

## Props

Each part's props are in its package's types; section 3 of the Claude artifact guide says where.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Summary cards: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/summary-cards.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-summary-cards--docs)
- Data visualization: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-foundations/data-visualization.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-foundations-data-visualization--docs)
