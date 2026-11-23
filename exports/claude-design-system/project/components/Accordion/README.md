# Accordion

Stacked sections that expand to show their content.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { Accordion, AccordionSection } = await wb("accordion");
```

## When to use it

- Long, skimmable content such as FAQs or unit outlines, where people open one part at a time.

## Get these right

- `children` must be an array: two or more `AccordionSection`s, or a single one wrapped in `[…]`.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-accordion@3.2.4/dist/components/accordion.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.
