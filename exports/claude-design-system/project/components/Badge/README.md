# Badge

Short status labels; each badge pairs its color with text or an icon.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { Badge, StatusBadge, NeutralBadge, DueBadge, GemBadge, StreakBadge } = await wb("badge");
```

## When to use it

- `StatusBadge` for success, warning, critical and info states; `DueBadge` for due dates; `NeutralBadge` for counts and categories.
- `GemBadge` and `StreakBadge` for Motivation features.

## Get these right

- `icon` on Badge, StatusBadge, NeutralBadge and DueBadge takes an element: wrap the string in `PhosphorIcon`.
- GemBadge and StreakBadge have no `icon`; use `showIcon`, plus `iconAriaLabel` when there's no `label`.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-badge@1.1.29/dist/types.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.

## Guidelines

The design guidelines for this component are linked, not copied here, and win over
anything above. Read the source (Markdown) or the rendered page:

- Badges: [source](https://raw.githubusercontent.com/Khan/design-system-guidelines/main/__docs__/design-components/badges.mdx), [page](https://khan.github.io/design-system-guidelines/?path=/docs/design-guidelines-components-feedback-badges--docs)
