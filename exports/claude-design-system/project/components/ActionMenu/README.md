# ActionMenu

A menu of actions behind one button, for secondary actions on an item.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { SingleSelect, MultiSelect, OptionItem, ActionMenu, ActionItem, SeparatorItem } = await wb("dropdown");
```

## When to use it

- Edit, duplicate, archive and similar actions on a row or card.

## Get these right

- `menuText` labels the default opener. A custom `opener` is a function that returns an element, without its own `onClick`.
- Items are `ActionItem`s with `label` and `onClick`; `SeparatorItem` divides groups.
- `ActionItem` has no destructive style. Put Delete or Remove last, after a `SeparatorItem`, and confirm it in a Modal with a destructive Button.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-dropdown@11.0.4/dist/util/types.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.
