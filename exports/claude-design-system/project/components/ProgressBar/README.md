# ProgressBar

A bar that shows a current value against a goal, optionally with an expected-by-today marker, in a chart container.

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

- "How close are we to the goal?": gems toward a class challenge, assignments completed toward a goal, students who finished.
- Progress means how far along, never how well. For a score or level, use a DistributionChart grouped by level.
- With no goal, use SummaryCards. For change over time, use a TrendChart.

## Get these right

- Always show the value and goal as text, "38 of 70 skills", not only as bar length. Never fill past 100%: say "Goal reached".
- Label the marker with its value: "Expected by today: 35". In a large container the title states the gap: "3 skills ahead of schedule".
- A small container (dashboards, side panels) holds one bar and up to four values: no controls, legend or marker.
- Bar colors are the role colors in Values, not WB tokens: WB has no data-visualization tokens yet, so they have no dark-theme value. Gem challenges use the Motivation role.
- Give the bar `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and `aria-valuetext`.
- Never draw progress as a gauge or dial.

## Values

Read from the DSG's example source at build time
([`ProgressExamples.tsx`](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/assets/progress-charts/ProgressExamples.tsx)), so they match the docs.
Use these exact values; the preview declares them the same way.

| Constant | Value | Note |
| --- | --- | --- |
| `SINGLE` | `{fill: "#8DA2FF",outline: "#6C82FF"}` | Bar colors are primitives (Blue 50/40 for Progress and amounts, Gray 40/20 for behind schedule, Gray 10 for the target marker) until data visualization semantic tokens exist in Wonder Blocks. See the Color TODO in the Data visualization foundation. |
| `BEHIND` | `{fill: "#A0A1A4",outline: "#717279"}` | Bar colors are primitives (Blue 50/40 for Progress and amounts, Gray 40/20 for behind schedule, Gray 10 for the target marker) until data visualization semantic tokens exist in Wonder Blocks. See the Color TODO in the Data visualization foundation. |
| `MARKER` | `"#4A4C53"` | Bar colors are primitives (Blue 50/40 for Progress and amounts, Gray 40/20 for behind schedule, Gray 10 for the target marker) until data visualization semantic tokens exist in Wonder Blocks. See the Color TODO in the Data visualization foundation. |

## Props

Each part's props are in its package's types; section 3 of the Claude artifact guide says where.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Progress charts: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/progress-charts.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-progress-charts--docs)
- Chart container: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/chart-container.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-data-visualization-chart-container--docs)
- Data visualization: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-foundations/data-visualization.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-foundations-data-visualization--docs)
