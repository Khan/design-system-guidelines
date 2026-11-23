# Pill

A small rounded label for categories, filters and counts.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { default: Pill } = await wb("pill");
```

## When to use it

- Tags and lightweight categories. For a status, use a Badge.

## Get these right

- The text goes in `children`.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-pill@3.1.83/dist/components/pill.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.
