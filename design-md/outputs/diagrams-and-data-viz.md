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
| Canvas | `#F8F9FB` | `#151521` |
| Node fill | `#FFFFFF` | `#252531` |
| Node border | 1px `#CBCBCD` | `#4A4C53` |
| Focal node fill | `#EBF1FD` | `#222149` |
| Focal node border | 2px `#6C82FF` | `#6C82FF` |
| Connector | 1.5–2px `#8A8B90` | `#8A8B90` |
| Node label | 16px weight 600, `#151521` | `#EDEDEE` |
| Connector label | 14px, `#4A4C53` | `#CBCBCD` |

- Nodes have a 12px radius and 16px padding. Decision nodes can be hexagons, the brand shape.
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
| 1 | Blue (indigo) | `#5753FA` | `#5753FA` |
| 2 | Cyan | `#28A9FF` | `#28A9FF` |
| 3 | Green | `#579F6C` | `#579F6C` |
| 4 | Magenta | `#E83FA4` | `#E83FA4` |
| 5 | Orange | `#F8551A` | `#F8551A` |
| 6 | Yellow | `#FCB706` | `#FCB706` |

Yellow isn't a token (see the core file's graphics palette). With many series on a dark surface, series 1 can use the lighter `#6C82FF` for contrast.

**Rules:**

- **Direct labels beat legends.** Label lines at their ends and bars at their tips.
- **Highlight, don't rainbow.** When one series matters, color it `#5753FA` (dark: `#6C82FF`, because the fill blue fails 3:1 on dark surfaces) and mute the rest to `#8A8B90` (dark: `#8A8B90`). Label muted series in subtle text (`#717279`; dark `#A0A1A4`), not in the line color.
- More than 6 series is too many: group the small ones into "Other".
- Don't put green next to red to mean good versus bad without labels, and never let color be the only encoding.
- Gridlines are 1px `#CBCBCD` (dark `#4A4C53`), and axes are `#8A8B90` (dark `#8A8B90`). Axis labels are 14px `#4A4C53` (dark `#CBCBCD`) with tabular figures.
- Learning progress uses the core file's learning-state colors (not started, attempted, complete), not the categorical palette.
- Lines are 2px; points are 6–8px. Bars have a 4px radius at the value end only.
- Meaningful marks need 3:1 contrast against the background.
