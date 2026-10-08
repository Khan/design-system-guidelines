# Diagrams, flowcharts, and charts

Read this together with the core
[DESIGN.md](https://khan.github.io/design-system-guidelines/design-md/DESIGN.md).
It covers diagrams, flowcharts, architecture drawings, and data visualization
in any medium (SVG, Figma, slides, HTML).

> **Draft:** pending design review. The categorical order and the node and
> connector styling here are new and haven't been signed off by design yet.

## Diagrams and flowcharts

| Element | thunderblocks | syl-dark |
| --- | --- | --- |
| Canvas | `{{tb:semanticColor.core.background.base.subtle}}` | `{{dark:semanticColor.core.background.base.subtle}}` |
| Node fill | `{{tb:semanticColor.core.background.base.default}}` | `{{dark:semanticColor.core.background.base.default}}` |
| Node border | {{tb:border.width.thin}} `{{tb:semanticColor.core.border.neutral.subtle}}` | `{{dark:semanticColor.core.border.neutral.subtle}}` |
| Focal node fill | `{{tb:semanticColor.core.background.instructive.subtle}}` | `{{dark:semanticColor.core.background.instructive.subtle}}` |
| Focal node border | {{tb:border.width.medium}} `{{tb:semanticColor.core.border.instructive.default}}` | `{{dark:semanticColor.core.border.instructive.default}}` |
| Connector | 1.5–2px `{{tb:semanticColor.core.border.neutral.default}}` | `{{dark:semanticColor.core.border.neutral.default}}` |
| Node label | {{tb:font.body.size.medium}} weight {{tb:font.weight.semi}}, `{{tb:semanticColor.core.foreground.neutral.strong}}` | `{{dark:semanticColor.core.foreground.neutral.strong}}` |
| Connector label | {{tb:font.body.size.small}}, `{{tb:semanticColor.core.foreground.neutral.default}}` | `{{dark:semanticColor.core.foreground.neutral.default}}` |

- Nodes have a {{tb:border.radius.radius_120}} radius and {{tb:sizing.size_160}} padding. Decision nodes can be hexagons, the brand shape.
- Arrowheads are small, filled, and the same color as the connector. Prefer orthogonal (right-angle) routing.
- There's one focal node per diagram, at most.
- Use intent colors only where the diagram *means* success, warning, or error, with a label or icon too.
- Diagrams are flat. No shadows, unless a node is literally a floating UI element.
- If the diagram may render in dark mode, use the syl-dark column, or the CSS variables in HTML.

## Data visualization

**Categorical order.** Assign series in this order, using the graphics
palette defaults:

| # | Hue | thunderblocks | syl-dark |
| --- | --- | --- | --- |
| 1 | Blue (indigo) | `{{tb:semanticColor.graphics.characters.flesh.blue.background.default}}` | `{{dark:semanticColor.graphics.characters.flesh.blue.background.default}}` |
| 2 | Cyan | `{{tb:semanticColor.graphics.characters.flesh.cyan.background.default}}` | `{{dark:semanticColor.graphics.characters.flesh.cyan.background.default}}` |
| 3 | Green | `{{tb:semanticColor.graphics.characters.flesh.green.background.default}}` | `{{dark:semanticColor.graphics.characters.flesh.green.background.default}}` |
| 4 | Magenta | `{{tb:semanticColor.graphics.characters.flesh.magenta.background.default}}` | `{{dark:semanticColor.graphics.characters.flesh.magenta.background.default}}` |
| 5 | Orange | `{{tb:semanticColor.graphics.characters.flesh.orange.background.default}}` | `{{dark:semanticColor.graphics.characters.flesh.orange.background.default}}` |
| 6 | Yellow | `#FCB706` | `#FCB706` |

Yellow isn't a token (see the core file's graphics palette). With many series on a dark surface, series 1 can use the lighter `{{dark:semanticColor.core.foreground.instructive.default}}` for contrast.

**Rules:**

- **Direct labels beat legends.** Label lines at their ends and bars at their tips.
- **Highlight, don't rainbow.** When one series matters, color it `{{tb:semanticColor.core.foreground.instructive.default}}` (dark: `{{dark:semanticColor.core.foreground.instructive.default}}`, because the fill blue fails 3:1 on dark surfaces) and mute the rest to `{{tb:semanticColor.core.border.neutral.default}}` (dark: `{{dark:semanticColor.core.border.neutral.default}}`). Label muted series in subtle text (`{{tb:semanticColor.core.foreground.neutral.subtle}}`; dark `{{dark:semanticColor.core.foreground.neutral.subtle}}`), not in the line color.
- More than 6 series is too many: group the small ones into "Other".
- Don't put green next to red to mean good versus bad without labels, and never let color be the only encoding.
- Gridlines are {{tb:border.width.thin}} `{{tb:semanticColor.core.border.neutral.subtle}}` (dark `{{dark:semanticColor.core.border.neutral.subtle}}`), and axes are `{{tb:semanticColor.core.border.neutral.default}}` (dark `{{dark:semanticColor.core.border.neutral.default}}`). Axis labels are {{tb:font.body.size.small}} `{{tb:semanticColor.core.foreground.neutral.default}}` (dark `{{dark:semanticColor.core.foreground.neutral.default}}`) with tabular figures.
- Learning progress uses the core file's learning-state colors (not started, attempted, complete), not the categorical palette.
- Lines are 2px; points are 6–8px. Bars have a {{tb:border.radius.radius_040}} radius at the value end only.
- Meaningful marks need 3:1 contrast against the background.
