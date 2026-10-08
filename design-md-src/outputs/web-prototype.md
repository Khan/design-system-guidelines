# Web prototypes, HTML pages, and Claude artifacts

Read this together with the core
[DESIGN.md](https://khan.github.io/design-system-guidelines/design-md/DESIGN.md).
It covers anything rendered in a browser without the Wonder Blocks React
components: standalone HTML, prototypes, Claude artifacts, and one-pagers.

## Quick start

Every token is published as a CSS custom property. One stylesheet gives you
all three themes, and the `data-wb-theme` attribute picks which one applies:

```html
<!doctype html>
<html lang="en" data-wb-theme="thunderblocks">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- All WB tokens as CSS variables (default, thunderblocks, syl-dark) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-tokens@{{meta:tokensMajor}}/dist/css/index.css" />
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Inconsolata:wght@400;700&family=Noto+Sans:wght@400;700&display=swap" />
  <style>
    /* WB tokens use rem on a 10px root: 1.6rem = 16px. This line is required. */
    html { font-size: 62.5%; }
    html[data-wb-theme="syl-dark"] { color-scheme: dark; }
    body {
      margin: 0;
      font-family: var({{name:font.family.sans}});
      font-size: var({{name:font.body.size.medium}});
      line-height: var({{name:font.body.lineHeight.medium}});
      font-weight: var({{name:font.weight.medium}});
      color: var({{name:semanticColor.core.foreground.neutral.strong}});
      background: var({{name:semanticColor.core.background.base.subtle}});
    }
  </style>
  <script>
    // Follow the OS light/dark preference
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => document.documentElement.setAttribute("data-wb-theme", mq.matches ? "syl-dark" : "thunderblocks");
    apply(); mq.addEventListener("change", apply);
  </script>
</head>
```

Notes:

- **The 62.5% root matters.** Without it, sizing and font tokens come out 1.6× too big. If the host page controls the root font size, don't load the stylesheet. Copy the px values from the core file instead.
- **`data-wb-theme` works on any element.** Put `data-wb-theme="syl-dark"` on one section to get a dark band inside a light page.
- **Build with the CSS variables, not hex,** so dark mode works for free. Variable names are `--wb-` plus the token path joined with dashes, for example `{{name:semanticColor.action.primary.progressive.default.background}}`, `{{name:sizing.size_160}}`, `{{name:border.radius.radius_080}}`, or `{{name:boxShadow.mid}}`.
- **Page structure:** a `base-subtle` page background, `base-default` cards, one primary button, and Phosphor icons ([web package](https://phosphoricons.com) or inline SVGs).

## Layout

- **Breakpoints** (not tokens): xs ≤ 567px, sm 568–681px, md 682–1023px, lg 1024–1199px, xl ≥ 1200px.
- Phone layouts use a 16px side gutter. Desktop content maxes out around 1200px.

## Component recipes

These recipes mirror the Wonder Blocks components. Values are
`thunderblocks`; use the CSS variables to get `syl-dark` automatically.
Component dimensions come from component-level tokens (`--wb-c-…`), which
are internal to each component and can change between releases.

### Button

| Size | Height | Inline padding |
| --- | --- | --- |
| Small | {{tb:c.button.root.sizing.height.small}} | {{tb:c.button.root.layout.padding.inline.primary.small}} |
| Medium (default) | {{tb:c.button.root.sizing.height.medium}} | {{tb:c.button.root.layout.padding.inline.primary.medium}} |
| Large | {{tb:c.button.root.sizing.height.large}} | {{tb:c.button.root.layout.padding.inline.primary.large}} |

Corners are {{tb:c.button.root.border.radius.default}}, becoming
{{tb:c.button.root.border.radius.press}} when pressed. Labels are weight
{{tb:c.button.root.font.weight.default}} in sentence case
({{tb:font.body.size.medium}}, or {{tb:c.button.root.font.size.large}} for
large). No underline.

| Kind | Rest | Hover / press |
| --- | --- | --- |
| Primary | bg `{{tb:semanticColor.action.primary.progressive.default.background}}`, text `{{tb:semanticColor.action.primary.progressive.default.foreground}}` | bg `{{tb:semanticColor.action.primary.progressive.hover.background}}` |
| Secondary | bg `{{tb:semanticColor.action.secondary.progressive.default.background}}`, {{tb:c.button.root.border.width.secondary.default}} border `{{tb:semanticColor.action.secondary.progressive.default.border}}`, text `{{tb:semanticColor.action.secondary.progressive.default.foreground}}` | border `{{tb:semanticColor.action.secondary.progressive.hover.border}}` |
| Tertiary | transparent, text `{{tb:semanticColor.action.tertiary.progressive.default.foreground}}` | text `{{tb:semanticColor.action.tertiary.progressive.hover.foreground}}`, {{tb:c.button.root.border.width.tertiary.hover}} inset outline `{{tb:semanticColor.action.tertiary.progressive.hover.border}}` |
| Destructive primary | bg `{{tb:semanticColor.action.primary.destructive.default.background}}`, text `{{tb:semanticColor.action.primary.destructive.default.foreground}}` | bg `{{tb:semanticColor.action.primary.destructive.hover.background}}` |
| Disabled | bg `{{tb:semanticColor.action.primary.disabled.background}}`, text `{{tb:semanticColor.action.primary.disabled.foreground}}` | — |

Learner-facing buttons can add the chonky shadow described in the core file.

### Focus

```css
:focus-visible {
  outline: var({{name:border.width.medium}}) solid var({{name:semanticColor.focus.outer}});
  outline-offset: var({{name:border.width.medium}});
  box-shadow: 0 0 0 var({{name:border.width.medium}}) var({{name:semanticColor.focus.inner}});
}
```

Every interactive element needs this.

### Text input

- {{tb:c.form-field.sizing.height}} tall, with {{tb:c.form-field.layout.paddingInline}} inline padding and a {{tb:c.form-field.border.radius}} radius.
- Background `{{tb:semanticColor.input.default.background}}`, {{tb:border.width.thin}} `{{tb:semanticColor.input.default.border}}` border.
- {{tb:font.body.size.medium}} text in `{{tb:semanticColor.input.default.foreground}}`, placeholder `{{tb:semanticColor.input.default.placeholder}}`.
- **Error:** a {{tb:c.form-field.border.width.error}} `{{tb:semanticColor.input.error.border}}` border, plus a message below the field. Don't rely on the red alone.
- **Read-only:** `{{tb:semanticColor.input.readOnly.background}}` background, text `{{tb:semanticColor.input.readOnly.text}}`.

### Card

- `{{tb:semanticColor.core.background.base.default}}` on a `{{tb:semanticColor.core.background.base.subtle}}` page.
- A {{tb:border.width.thin}} `{{tb:semanticColor.core.border.neutral.subtle}}` border, always.
- Radius {{tb:border.radius.radius_080}} and padding {{tb:sizing.size_160}} by default. Use {{tb:border.radius.radius_120}} and {{tb:sizing.size_240}} for larger, roomier cards.
- To lift a card, add `{{name:boxShadow.low}}` on top of the border.

> **Draft:** pending design review. The earlier draft used 12px / 24px as the
> card default; these values follow the Wonder Blocks `Card` defaults.

### Banner / callout

- Background, icon, and text come from the intent's feedback tokens (`--wb-semanticColor-feedback-<intent>-subtle-…`). Info is bg `{{tb:semanticColor.feedback.info.subtle.background}}`, icon `{{tb:semanticColor.feedback.info.subtle.icon}}`, text `{{tb:semanticColor.feedback.info.subtle.text}}`.
- No visible border in `thunderblocks` (it's transparent), radius {{tb:c.banner.root.border.radius}}, inline padding {{tb:c.banner.root.layout.paddingInlineStart}}, and a {{tb:c.banner.icon.sizing.height}} intent icon.
- The "strong" variant uses a `{{tb:semanticColor.feedback.info.strong.background}}` background with `{{tb:semanticColor.feedback.info.strong.text}}` text.

| Intent | Background | Icon | Text |
| --- | --- | --- | --- |
| Info | `{{tb:semanticColor.feedback.info.subtle.background}}` | `{{tb:semanticColor.feedback.info.subtle.icon}}` | `{{tb:semanticColor.feedback.info.subtle.text}}` |
| Success | `{{tb:semanticColor.feedback.success.subtle.background}}` | `{{tb:semanticColor.feedback.success.subtle.icon}}` | `{{tb:semanticColor.feedback.success.subtle.text}}` |
| Warning | `{{tb:semanticColor.feedback.warning.subtle.background}}` | `{{tb:semanticColor.feedback.warning.subtle.icon}}` | `{{tb:semanticColor.feedback.warning.subtle.text}}` |
| Critical | `{{tb:semanticColor.feedback.critical.subtle.background}}` | `{{tb:semanticColor.feedback.critical.subtle.icon}}` | `{{tb:semanticColor.feedback.critical.subtle.text}}` |

### Badge

- {{tb:font.body.size.xsmall}} / {{tb:font.body.lineHeight.xsmall}} text at weight {{tb:font.weight.bold}}.
- {{tb:sizing.size_040}} block and {{tb:sizing.size_080}} inline padding, {{tb:border.radius.radius_080}} radius, {{tb:border.width.thin}} border.
- Neutral: bg `{{tb:semanticColor.core.background.neutral.subtle}}`, border `{{tb:semanticColor.core.border.neutral.subtle}}`, text `{{tb:semanticColor.core.foreground.neutral.strong}}`.
- Status badges use the feedback tokens from the banner table, with the border `--wb-semanticColor-feedback-<intent>-subtle-border`.
- Badges are non-interactive.

### Link

- Weight {{tb:c.link.root.font.weight}}, color `{{tb:semanticColor.link.rest}}`, hover and press `{{tb:semanticColor.link.hover}}`. In `syl-dark` it's `{{dark:semanticColor.link.rest}}`, hover `{{dark:semanticColor.link.hover}}`.
- **Links inside running text are always underlined** ({{tb:font.textDecoration.thickness}} thick, {{tb:font.textDecoration.underlineOffset}} offset). Color alone isn't enough to mark them.
- Standalone links (navigation, "See all") underline on hover.
