# Button

The Wonder Blocks button for every action on a page; `kind` sets its weight.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { default: Button } = await wb("button");
```

## When to use it

- `primary` for the one action the view is for (at most one per view), `secondary` beside it, `tertiary` for low-emphasis actions.
- `actionType="destructive"` for delete and remove, `"neutral"` for actions that shouldn't draw the eye.
- Navigation between pages is a Link, not a Button.

## Get these right

- Icons go in `startIcon`/`endIcon` as the string `await icon("plus-bold")` returns.
- Never re-create a button with a styled `<button>` or `<div>`; the component carries focus, states and the chonky edge.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-button@11.7.15/dist/util/button.types.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Buttons: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/buttons.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-buttons-buttons--docs)
