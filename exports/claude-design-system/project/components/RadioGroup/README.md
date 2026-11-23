# RadioGroup

One choice from a short list, with every option visible.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { TextField, TextArea, Checkbox, CheckboxGroup, RadioGroup, Choice } = await wb("form");
```

## When to use it

- Two to six mutually exclusive options. Longer lists use a SingleSelect.

## Get these right

- Needs `groupName`, `label`, `selectedValue` and `onChange`; options are `Choice`s.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-form@7.7.9/dist/components/radio-group.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Radio button: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/radio-button.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-inputs-radio-button--docs)
