# TrendChart

A line chart of a value across time, like average score by assessment window, in a large chart container.

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

- "How has it changed?" across three or more periods. With one or two periods, use a stat card with the change.
- Not for categories that aren't in time order (DistributionChart).

## Get these right

- The title states the change and since when: "Scores climbed 133 points since the last assessment".
- A 2px line with a dot per point and a light area fill under a single line. Up to four lines, labeled at their ends, with no legend.
- Show the whole time axis, with future periods labeled but empty. Leave a gap for a missing period; never draw it as zero.
- The value axis may start above zero, labeled with units. Don't squeeze it to make a small change look dramatic.
- Line colors are role colors from Values, not WB tokens: WB has no data-visualization tokens yet, so they have no dark-theme value.
- Each point is focusable and announces its period and value: "Middle of year: 768".

## Values

Read from the DSG's example source at build time
([`GrowthOverTimeChart.tsx`](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/assets/trend-charts/GrowthOverTimeChart.tsx)), so they match the docs.
Use these exact values; the preview declares them the same way.

| Constant | Value | Note |
| --- | --- | --- |
| `LINE` | `"#6C82FF"` | Line colors are primitives (Blue 40 line, Blue 50 fill for Progress and amounts) until data visualization semantic tokens exist in Wonder Blocks. See the Color TODO in the Data visualization foundation. |
| `FILL` | `"#8DA2FF"` | Line colors are primitives (Blue 40 line, Blue 50 fill for Progress and amounts) until data visualization semantic tokens exist in Wonder Blocks. See the Color TODO in the Data visualization foundation. |

## Props

Each part's props are in its package's types; section 3 of the Claude artifact guide says where.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Trend charts: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/trend-charts.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-trend-charts--docs)
- Chart container: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/chart-container.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-chart-container--docs)
- Data visualization: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-foundations/data-visualization.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-foundations-data-visualization--docs)
