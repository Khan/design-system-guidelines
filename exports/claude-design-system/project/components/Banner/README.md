# Banner

A full-width message about the page or a section, with an optional action and dismiss.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { default: Banner } = await wb("banner");
```

## When to use it

- `kind` matches the message: `info`, `success`, `warning` or `critical`.
- Use one banner per region; for a short-lived confirmation, use a toast.

## Get these right

- `icon` takes the string from `await icon("…")`.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-banner@5.2.4/dist/components/banner.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Banners: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/banners.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-feedback-banners--docs)
