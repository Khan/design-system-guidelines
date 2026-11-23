# IconButton

An icon-only button for compact, well-known actions such as close, settings or more.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { default: IconButton } = await wb("icon-button");
```

## When to use it

- Toolbars, card corners and dense rows where the icon's meaning is obvious.
- Use a Button with a label when the action needs words.

## Get these right

- `aria-label` is required.
- `icon` takes the string from `await icon("…")`.
- Wrap it in a Tooltip that repeats the label when the icon isn't universal.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-icon-button@12.0.4/dist/util/icon-button.types.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Buttons: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/buttons.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-buttons-buttons--docs)
