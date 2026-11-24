# CircularSpinner

An indeterminate loading indicator.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { CircularSpinner } = await wb("progress-spinner");
```

## When to use it

- Waits longer than about a second where the layout of the result isn't known.

## Get these right

- `size` is required (`xsmall`, `small`, `medium`, `large`).

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-progress-spinner@3.2.2/dist/components/circular-spinner.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.
