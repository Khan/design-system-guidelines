# Tooltip

A short hint that appears on hover or focus of its anchor.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { default: Tooltip } = await wb("tooltip");
const { default: IconButton, ActivityIconButton } = await wb("icon-button");
```

## When to use it

- A label for an icon-only control, or a one-line explanation. Longer content goes in a Popover.

## Get these right

- `placement` is required (e.g. `"top"`).
- Wrapping an already-focusable element (Button, IconButton) can take `forceAnchorFocusivity=${false}`.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-tooltip@4.2.18/dist/components/tooltip.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Tooltips: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/tooltips.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-feedback-tooltips--docs)
