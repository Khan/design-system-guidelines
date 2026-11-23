# Link

Inline and standalone text links that navigate.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { default: Link } = await wb("link");
```

## When to use it

- Navigation to another page or section. For an in-page action, use a Button.

## Get these right

- In an artifact there's no router: give it a hash `href` such as `"#all-units"`. `onClick` can't prevent navigation.
- `startIcon`/`endIcon` take an element: wrap the icon string in `PhosphorIcon`.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-link@10.5.5/dist/components/link.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.
