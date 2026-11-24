# SearchField

A text field with a search icon and a clear button.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { default: SearchField } = await wb("search-field");
```

## When to use it

- Filtering a list on the page or searching content.

## Get these right

- Label it: inside `LabeledField`, or with `aria-label` when a visible label isn't needed.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-search-field@5.2.9/dist/components/search-field.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Search field: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/search-field.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-inputs-search-field--docs)
