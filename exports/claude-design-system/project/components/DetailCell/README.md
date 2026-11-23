# DetailCell

A list row with a title, up to two subtitles and accessories on either side.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { CompactCell, DetailCell } = await wb("cell");
const { PhosphorIcon } = await wb("icon");
```

## When to use it

- Rows in lists of lessons, students or settings. A row with only a title is `CompactCell`.

## Get these right

- `leftAccessory`/`rightAccessory` take an element: wrap an icon string in `PhosphorIcon`.
- Give it `onClick` or `href` only when the whole row is one action.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-cell@6.4.2/dist/util/types.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.
