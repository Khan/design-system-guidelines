# TextField

A single-line text input, labelled and validated with `LabeledField`.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { TextField, TextArea, Checkbox, CheckboxGroup, RadioGroup, Choice } = await wb("form");
const { LabeledField } = await wb("labeled-field");
```

## When to use it

- Short free-text answers such as names and titles. Multi-line text is `TextArea`.

## Get these right

- Wrap it in `LabeledField`, which takes the control in `field=${…}` and passes `id`, `error` and aria props itself. Don't set `error` on the field by hand.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-form@7.7.9/dist/components/text-field.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Text field: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/text-field.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-inputs-text-field--docs)
