# Checkbox

Checkboxes for on/off choices and for picking several options from a short list.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { TextField, TextArea, Checkbox, CheckboxGroup, RadioGroup, Choice } = await wb("form");
```

## When to use it

- One `Checkbox` for a single yes/no; `CheckboxGroup` with `Choice`s for several options.

## Get these right

- `CheckboxGroup` needs `groupName`, `label`, `selectedValues` and `onChange`.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-form@7.7.9/dist/components/checkbox-group.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Checkbox group: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/checkbox-group.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-inputs-checkbox-group--docs)
