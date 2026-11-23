# Modal

`ModalLauncher` with an `OnePaneDialog` opens a focused task over the page.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { ModalLauncher, OnePaneDialog } = await wb("modal");
const { default: Button, ActivityButton } = await wb("button");
const { Heading, BodyText, BodyMonospace } = await wb("typography");
```

## When to use it

- A short task or confirmation that has to finish before going back to the page.

## Get these right

- `modal` is an OnePaneDialog element, or `${({ closeModal }) => html`…`}` when the footer needs to close it.
- Put `onClose` on the `ModalLauncher`, never on the `OnePaneDialog`: WB throws when the dialog has its own.
- The theme must be on `<html>` (the boot does this) because the modal renders in a portal.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-modal@8.10.7/dist/components/one-pane-dialog.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Modals: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/modals.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-overlays-modals--docs)
- Modals - selection: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/modals-selection.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-overlays-modals-selection--docs)
