# ActivityButton

The chonky buttons for learner activities; `ActivityIconButton` is the icon-only one for practice tools.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { default: Button, ActivityButton } = await wb("button");
const { default: IconButton, ActivityIconButton } = await wb("icon-button");
```

## When to use it

- Only in the learner experience: primary and secondary actions in the core learning journey, like Continue, Check or Start quiz.
- `ActivityIconButton` for quick tools in practice and learning mode, like Check or Draw.
- Never in admin or teacher interfaces, modals, pagination, table controls or settings menus: use Button and IconButton there.

## Get these right

- `children` is a plain string. `startIcon`/`endIcon` take the string `await icon("…")` returns.
- `ActivityIconButton` takes `label` (a visible label) or `aria-label`, never both; `actionType` is `"progressive"` or `"neutral"`.
- Its props are in `dist/components/activity-button.d.ts` (button) and `dist/components/activity-icon-button.d.ts` (icon-button), not the shared types file.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-button@11.7.15/dist/components/activity-button.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Buttons: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/buttons.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-buttons-buttons--docs)
