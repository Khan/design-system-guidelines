# Diagrams and flowcharts

Read this together with the core
[DESIGN.md](../DESIGN.md).
It covers diagrams, flowcharts, and architecture drawings in any medium (SVG,
Figma, slides, HTML). It doesn't cover charts or data visualization. For
those, see [Charts and data visualization](../DESIGN.md#charts-and-data-visualization).

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
