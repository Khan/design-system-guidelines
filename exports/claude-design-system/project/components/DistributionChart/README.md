# DistributionChart

A bar chart of how many students, classes or schools land in each range, in a large chart container.

**A pattern, not a Wonder Blocks component.** Wonder Blocks has no component for this yet,
so build it from the WB parts below, the way this card's preview does. The design
guidelines linked at the end define it; the preview follows the DSG's own example.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the parts:

```js
const { Heading, BodyText, BodyMonospace } = await wb("typography");
const { default: IconButton, ActivityIconButton } = await wb("icon-button");
```

## When to use it

- "How is the group spread out?": assignments completed, schools by average score, students at each level.
- Not for change over time (TrendChart), individual values (DataTable), or fewer than about 10 students (a table or a sentence).

## Get these right

- 4 to 8 equal-width ranges in order, with an en dash (`1–2`), a "none" range when zero is possible, and an open last range (`11+`). Keep empty ranges, labeled 0. Never sort by bar height.
- The value axis starts at zero. Put the count above every bar. Never rotate range labels: switch to horizontal bars.
- The ranges that carry the title's point use EMPHASIS; the rest use COMPARISON. Never color bars for any other reason.
- When the title says "most" or "few", the description gives the number: "74 of 92 students".
- Bar colors are role colors from Values, not WB tokens: WB has no data-visualization tokens yet, so they have no dark-theme value. Level colors (Assessment, Mastery roles) aren't defined yet.
- Each bar is focusable and announces its range and count: "5–6 assignments: 40 students".

## Values

Read from the DSG's example source at build time
([`AssignmentsCompletedChart.tsx`](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/assets/distribution-charts/AssignmentsCompletedChart.tsx)), so they match the docs.
Use these exact values; the preview declares them the same way.

| Constant | Value | Note |
| --- | --- | --- |
| `EMPHASIS` | `{fill: "#8DA2FF",outline: "#6C82FF"}` | Chart mark colors are primitives (Blue 50/40 for Emphasis, Blue 70/40 for comparison) until data visualization semantic tokens exist in Wonder Blocks. See the Color TODO in the Data visualization foundation. |
| `COMPARISON` | `{fill: "#DFEAFF",outline: "#6C82FF"}` | Chart mark colors are primitives (Blue 50/40 for Emphasis, Blue 70/40 for comparison) until data visualization semantic tokens exist in Wonder Blocks. See the Color TODO in the Data visualization foundation. |

## Props

Each part's props are in its package's types; section 3 of the Claude artifact guide says where.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Distribution charts: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/distribution-charts.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-distribution-charts--docs)
- Chart container: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/chart-container.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-chart-container--docs)
- Data visualization: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-foundations/data-visualization.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-foundations-data-visualization--docs)
