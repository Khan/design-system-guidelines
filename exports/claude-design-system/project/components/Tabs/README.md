# Tabs

Switches between panels of related content in one place.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { Tabs, NavigationTabs, NavigationTabItem } = await wb("tabs");
const { Heading, BodyText, BodyMonospace } = await wb("typography");
```

## When to use it

- Two to six peer views of the same object. Page-level navigation is `NavigationTabs`.

## Get these right

- `aria-label` (or `aria-labelledby`) is required.
- `tabs` is an array of `{ id, label, panel }`; control it with `selectedTabId` and `onTabSelected`.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-tabs@1.0.14/dist/components/tabs.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.
