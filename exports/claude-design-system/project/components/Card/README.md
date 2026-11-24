# Card

A raised or outlined container that groups one piece of content.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { Card } = await wb("card");
const { Heading, BodyText, BodyMonospace } = await wb("typography");
```

## When to use it

- One lesson, assignment, stat or settings group per card.

## Get these right

- `Card` has no `style`; use `styles=${ {root: {…}} }` for width and layout, and the props for the rest: `paddingSize` (none, small, medium), `elevation` (none, low), `borderRadius` (small, medium) and `background` (base-subtle, base-default).
- Don't nest cards or add a colored left-border accent.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-card@1.5.5/dist/components/card.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.
