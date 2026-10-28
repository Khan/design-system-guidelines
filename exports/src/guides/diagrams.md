# Diagrams and flowcharts

Read this together with the core
[DESIGN.md](../DESIGN.md).
It covers diagrams, flowcharts, and architecture drawings in any medium (SVG,
Figma, slides, HTML). It doesn't cover charts or data visualization. For
those, see [Charts and data visualization](../DESIGN.md#charts-and-data-visualization).

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
