# Breadcrumbs

Shows where a page sits in a hierarchy, with links to its ancestors.

## Load it

In a Claude artifact or prototype, start from the page skeleton in the
[Claude artifact guide](../../claude-artifact.md), then load the package:

```js
const { Breadcrumbs, BreadcrumbsItem } = await wb("breadcrumbs");
const { default: Link } = await wb("link");
```

## When to use it

- Deep content such as course › unit › lesson. The current page is the last item, not a link.

## Get these right

- Ancestor items wrap a `Link` with a hash `href` in an artifact.

## Props

Read the props from the package's types at the pinned version, never from
memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-breadcrumbs@3.3.8/dist/components/breadcrumbs.d.ts>.
Section 3 of the Claude artifact guide lists where other components' props live.
