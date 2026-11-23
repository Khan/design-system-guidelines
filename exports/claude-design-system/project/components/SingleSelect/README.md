# SingleSelect

A dropdown for choosing one option from a list; `MultiSelect` chooses several.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { SingleSelect, MultiSelect, OptionItem, ActionMenu, ActionItem, SeparatorItem } = await wb("dropdown");
```

## When to use it

- Seven or more options, or when space is tight. Fewer options read better as a RadioGroup.

## Get these right

- `placeholder` is required.
- Options are `OptionItem`s with `label` and `value`.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-dropdown@11.0.4/dist/util/types.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Dropdown select: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/dropdown-select.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-inputs-dropdown-select--docs)
