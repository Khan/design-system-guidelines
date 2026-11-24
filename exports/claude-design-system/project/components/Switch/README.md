# Switch

A toggle for a setting that takes effect immediately.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { default: Switch } = await wb("switch");
const { Heading, BodyText, BodyMonospace } = await wb("typography");
```

## When to use it

- Settings that apply at once. Choices that are saved with a form are checkboxes.

## Get these right

- `Switch` has no label: pair it with `BodyText tag="label" htmlFor="x"` and give the Switch `id="x"`.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-switch@3.4.17/dist/components/switch.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Toggle: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/toggle.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-inputs-toggle--docs)
