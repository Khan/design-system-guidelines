# Typography

`Heading` and `BodyText` set every piece of text in the Wonder Blocks type scale.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { Heading, BodyText, BodyMonospace } = await wb("typography");
```

## When to use it

- `Heading` for titles and section heads; pick `size` for the look and `tag` for the outline (`h1`–`h6`).
- `BodyText` for paragraphs and UI text; `tag="label"` with `htmlFor` makes it a form label.

## Get these right

- The old `Title`, `LabelLarge` and similar components no longer exist.
- Don't set your own px or rem text sizes; use these components or the `--wb-font-*-size-*` variables.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-core@12.5.0/dist/components/text.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.
