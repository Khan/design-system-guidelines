# Popover

A small anchored panel with a title and a few lines of content.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { Popover, PopoverContent } = await wb("popover");
const { default: Button, ActivityButton } = await wb("button");
```

## When to use it

- Extra detail or a short form tied to one control. A one-line hint is a Tooltip.

## Get these right

- `Popover` and `PopoverContent` are named exports, not default.
- Wrap the trigger as `${({ open }) => html`<${Button} onClick=${open}>…</${Button}>`}`; `PopoverContent` takes `title` and `content` as strings.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-popover@7.1.6/dist/components/popover.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Popovers: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/popovers.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-overlays-popovers--docs)
