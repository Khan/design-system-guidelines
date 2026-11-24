# Claude artifacts with Wonder Blocks components

Read this together with the core
[DESIGN.md](README.md).
It covers Claude artifacts built with the real Wonder Blocks (WB) React
components. For plain HTML that doesn't load React, use the
[web prototype guide](web-prototype.md) instead.

The components load as ES modules from jsDelivr. The artifact sandbox is
strict: scripts may come only from a few CDNs (jsDelivr's `/npm/` included),
stylesheets only from Google Fonts, images only as `data:` or `blob:`, and
there is no `fetch`. So the usual `<link>` to the token stylesheet is blocked.
The setup below works inside those rules.

**Copy the lines marked "copy verbatim" exactly.** Every one fixes a real
failure. You may add your own CSS, extra `<meta>` tags, and your own imports
and UI code after the `end WB boot` line.

The versions in `V` are pinned for this setup and were tested together on
2026-11-23, including live on claude.ai. They're loaded from the CDN and can
be newer than the tokens version DESIGN.md is generated from.

## 1. Page skeleton (copy verbatim)

An artifact page is an HTML fragment: no `<!doctype>`, `<html>`, `<head>` or `<body>` tags. Keep this order — the import map must come before the module script.

```html
<meta charset="utf-8">
<title>Your page name</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inconsolata:wght@400;700&display=swap">
<script type="importmap">
{"imports": {
  "https://cdn.jsdelivr.net/npm/aphrodite@1.2.5/+esm": "https://cdn.jsdelivr.net/npm/aphrodite@2.4.0/+esm",
  "https://cdn.jsdelivr.net/npm/react@18.1.0/": "https://cdn.jsdelivr.net/npm/react@18.2.0/",
  "https://cdn.jsdelivr.net/npm/react@19.0.0/": "https://cdn.jsdelivr.net/npm/react@18.2.0/",
  "https://cdn.jsdelivr.net/npm/react@19.2.4/": "https://cdn.jsdelivr.net/npm/react@18.2.0/",
  "https://cdn.jsdelivr.net/npm/react@19.2.7/": "https://cdn.jsdelivr.net/npm/react@18.2.0/",
  "https://cdn.jsdelivr.net/npm/react@19.2.8/": "https://cdn.jsdelivr.net/npm/react@18.2.0/",
  "https://cdn.jsdelivr.net/npm/react-dom@18.1.0/": "https://cdn.jsdelivr.net/npm/react-dom@18.2.0/",
  "https://cdn.jsdelivr.net/npm/react-dom@19.2.7/": "https://cdn.jsdelivr.net/npm/react-dom@18.2.0/",
  "https://cdn.jsdelivr.net/npm/react-dom@19.2.8/": "https://cdn.jsdelivr.net/npm/react-dom@18.2.0/",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/bold/arrow-square-out-bold.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/arrow-square-out-bold/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/bold/calendar-blank-bold.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/calendar-blank-bold/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/bold/caret-down-bold.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/caret-down-bold/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/bold/check-bold.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/check-bold/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/bold/info-bold.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/info-bold/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/bold/lock-bold.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/lock-bold/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/bold/magnifying-glass-bold.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/magnifying-glass-bold/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/bold/minus-bold.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/minus-bold/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/bold/smiley-bold.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/smiley-bold/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/bold/warning-bold.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/warning-bold/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/bold/warning-circle-bold.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/warning-circle-bold/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/bold/x-bold.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/x-bold/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/fill/check-circle-fill.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/check-circle-fill/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/regular/caret-down.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/caret-down/+esm",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/regular/x.svg/+esm": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/x/+esm"
}}
</script>
<style>
  html { font-size: 62.5%; } /* WB tokens are rem on a 10px root, as on khanacademy.org. Without this everything is 1.6x too big. */
  html, body { margin: 0; background: var(--wb-semanticColor-core-background-base-subtle); color: var(--wb-semanticColor-core-foreground-neutral-strong); font-family: var(--wb-font-family-sans); }
  body { font-size: var(--wb-font-body-size-medium); line-height: var(--wb-font-body-lineHeight-medium); }
  #root { padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
  #wb-error { white-space: pre-wrap; font: 13px ui-monospace, monospace; color: #c00; padding: 16px; }
  /* your own layout CSS here — use WB CSS variables (var(--wb-…)) for colors and spacing */
</style>
<div id="root"><p style="padding:16px">Loading Wonder Blocks…</p></div>
<script type="module">
// ---------- WB boot: copy verbatim ----------
const NPM = "https://cdn.jsdelivr.net/npm/";
const V = { tokens: "18.2.1", core: "12.5.0", button: "11.7.15", "icon-button": "12.0.4", icon: "6.0.5", typography: "5.0.8", layout: "4.0.0", card: "1.5.5", pill: "3.1.83", badge: "1.1.29", banner: "5.2.4", form: "7.7.9", switch: "3.4.17", dropdown: "11.0.4", modal: "8.10.7", popover: "7.1.6", tooltip: "4.2.18", toolbar: "5.1.67", tabs: "1.0.14", accordion: "3.2.4", breadcrumbs: "3.3.8", link: "10.5.5", "progress-spinner": "3.2.2", cell: "6.4.2", "search-field": "5.2.9", "date-picker": "1.2.7", "birthday-picker": "4.2.10", "labeled-field": "4.3.9", theming: "4.1.0" };
// wb("button") loads a package; destructuring a name it doesn't export throws a readable error instead of rendering nothing
const wb = (name) => import(`${NPM}@khanacademy/wonder-blocks-${name}@${V[name]}/+esm`).then((m) => new Proxy(m, { get(t, k) {
  if (typeof k === "string" && k !== "then" && !(k in t)) throw new Error(`wonder-blocks-${name} has no export "${k}". It exports: ${Object.keys(t).join(", ")}`);
  return t[k];
} }));
const svgUri = (d) => "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${d.width} ${d.height}">${d.body}</svg>`);
// icon("plus-bold") -> data-URI string usable anywhere WB wants a Phosphor icon (names: phosphoricons.com, weight suffix -bold / -fill, none for regular)
const icon = async (name) => svgUri((await import(`${NPM}@iconify-icons/ph@2.0.0/${name}/+esm`)).default);
const setTheme = (t) => { document.documentElement.setAttribute("data-wb-theme", t); document.documentElement.style.colorScheme = t === "syl-dark" ? "dark" : "light"; };
// A crash after load (in a click handler or a render) would otherwise blank the page silently; show it instead
addEventListener("error", (ev) => { const e = ev.error || ev.message; document.getElementById("root").innerHTML = '<pre id="wb-error"></pre>'; document.getElementById("wb-error").textContent = "Wonder Blocks page error:\n" + (e && e.stack || e); });
// Follow the viewer's light/dark theme (the host's data-theme attribute, else the OS preference): syl-dark is WB's dark theme, thunderblocks its light theme
const hostTheme = () => { const t = document.documentElement.getAttribute("data-theme"); return t === "dark" || (t !== "light" && matchMedia("(prefers-color-scheme: dark)").matches) ? "syl-dark" : "thunderblocks"; };
const initialTheme = hostTheme();
try {
  setTheme(initialTheme);
  const followHost = () => setTheme(hostTheme());
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", followHost);
  new MutationObserver(followHost).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  await import(`${NPM}@khanacademy/wonder-blocks-tokens@${V.tokens}/dist/css/index.css/+esm`); // injects the WB token CSS
  const { PhosphorIcon: BootPhosphorIcon } = await wb("icon"); // boot-only name: import PhosphorIcon yourself from section 2
  const imap = JSON.parse(document.querySelector('script[type="importmap"]').textContent).imports;
  await Promise.all(Object.values(imap).filter((u) => u.includes("@iconify-icons/ph@")).map((u) => import(u).then((m) => {
    const d = m.default, uri = svgUri(d); // WB's built-in icons: make them work as both string and element
    Object.setPrototypeOf(d, String.prototype);
    Object.assign(d, { toString: () => uri, valueOf: () => uri, $$typeof: Symbol.for("react.element"), type: BootPhosphorIcon, key: null, ref: null, props: { icon: uri }, _owner: null, _store: {} });
  })));
  const [React, { createRoot }, { default: htm }] = await Promise.all([import(`${NPM}react@18.2.0/+esm`), import(`${NPM}react-dom@18.2.0/client/+esm`), import(`${NPM}htm@3.1.1/+esm`)]);
  const html = htm.bind(React.createElement);
// ---------- end WB boot ----------

  // Your code starts here. Load only the packages you use, in parallel; copy each destructuring line from section 2.
  const [{ default: Button }, { Heading, BodyText }, { View }] = await Promise.all([wb("button"), wb("typography"), wb("core")]);
  const plusIcon = await icon("plus-bold");

  // Keep this check after your imports.
  const dupes = performance.getEntriesByType("resource").map((e) => e.name).filter((n) => /\/npm\/react(-dom)?@(?!18\.2\.0\/)/.test(n));
  if (dupes.length) throw new Error("A second React copy loaded. Add a prefix mapping to react@18.2.0 in the import map for:\n" + dupes.join("\n"));

  function App() {
    return html`
      <${View} style=${{ padding: 24, gap: 16 }}>
        <${Heading} size="xlarge" tag="h1">Hello Wonder Blocks</${Heading}>
        <${BodyText}>This page follows your light or dark theme.</${BodyText}>
        <${Button} startIcon=${plusIcon} onClick=${() => {}}>New item</${Button}>
      </${View}>`;
  }
  createRoot(document.getElementById("root")).render(html`<${App} />`);
} catch (e) {
  document.getElementById("root").innerHTML = '<pre id="wb-error"></pre>';
  document.getElementById("wb-error").textContent = "Wonder Blocks failed to load:\n" + (e && e.stack || e);
}
</script>
```

## 2. Imports (copy the lines you need)

Copy these destructuring lines exactly. Watch which components are `default` exports and which are named.

```js
const { default: Button, ActivityButton } = await wb("button");          // ActivityButton: learner activities only
const { default: IconButton, ActivityIconButton } = await wb("icon-button");
const { PhosphorIcon } = await wb("icon");
const { Heading, BodyText, BodyMonospace } = await wb("typography");   // old Title/LabelLarge/etc. no longer exist
const { View } = await wb("core");
const { Strut, Spring } = await wb("layout");
const { Card } = await wb("card");
const { default: Pill } = await wb("pill");
const { Badge, StatusBadge, NeutralBadge, DueBadge, GemBadge, StreakBadge } = await wb("badge");
const { default: Banner } = await wb("banner");
const { TextField, TextArea, Checkbox, CheckboxGroup, RadioGroup, Choice } = await wb("form");
const { default: Switch } = await wb("switch");
const { SingleSelect, MultiSelect, OptionItem, ActionMenu, ActionItem, SeparatorItem } = await wb("dropdown");
const { ModalLauncher, OnePaneDialog } = await wb("modal");
const { Popover, PopoverContent } = await wb("popover");             // named, NOT default
const { default: Tooltip } = await wb("tooltip");
const { default: Toolbar } = await wb("toolbar");
const { Tabs, NavigationTabs, NavigationTabItem } = await wb("tabs");
const { Accordion, AccordionSection } = await wb("accordion");
const { Breadcrumbs, BreadcrumbsItem } = await wb("breadcrumbs");
const { default: Link } = await wb("link");
const { CircularSpinner } = await wb("progress-spinner");
const { CompactCell, DetailCell } = await wb("cell");
const { default: SearchField } = await wb("search-field");
const { DatePicker } = await wb("date-picker");
const { default: BirthdayPicker } = await wb("birthday-picker");
const { LabeledField } = await wb("labeled-field");
const { semanticColor, sizing, border, font } = await wb("tokens");   // values are var(--wb-…) strings for inline styles
```

To load several in parallel: `const [{ default: Button }, { Card }] = await Promise.all([wb("button"), wb("card")]);`

## 3. Looking up props

Never guess a prop from its name or from another library. The source of truth is each package's TypeScript types on jsDelivr:

1. List the files: `https://data.jsdelivr.com/v1/packages/npm/@khanacademy/wonder-blocks-<pkg>@<version from V>?structure=flat`
2. Read the props: `https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-<pkg>@<version>/dist/components/<component>.d.ts`. Some live in shared files instead:
   - Button: `dist/util/button.types.d.ts`; IconButton: `dist/util/icon-button.types.d.ts`
   - ActivityButton: button `dist/components/activity-button.d.ts`; ActivityIconButton: icon-button `dist/components/activity-icon-button.d.ts` (it takes `label` or `aria-label`, not both)
   - CompactCell/DetailCell: cell `dist/components/compact-cell.d.ts` or `dist/components/detail-cell.d.ts` for their own props (DetailCell's `subtitle1`/`subtitle2`), and `dist/util/types.d.ts` for the shared `CellProps`
   - badges: badge `dist/types.d.ts`; Popover `placement`: popover `dist/util/types.d.ts`; PhosphorIcon `size`: icon `dist/types.d.ts`; ActionItem/OptionItem: dropdown `dist/util/types.d.ts`
   - Heading/BodyText `tag`, `id`, `className` and `style`: `wonder-blocks-core/dist/components/text.d.ts`
   - `dist/index.d.ts` shows whether an export is named or default (section 2 already has this right).

If you have a WB Storybook docs tool (`docs-show`) that covers components, it works too. The Design Guidelines docs server covers usage guidance, not props.

## 4. Rules and gotchas

**Markup (htm, no build step).** Write ``html`<${Button} kind="secondary" onClick=${fn}>Save</${Button}>` ``. Pass every non-string value with `${…}`: `disabled=${true}`, `style=${ {gap: 8} }`. Close a component with `</${Name}>`. Use `className`, not `class`, on WB components. A mapped array (`${items.map(...)}`) counts as array children. Don't load Babel.

**Themes.** The theme is the `data-wb-theme` attribute on `<html>`. The boot sets it from the viewer's light/dark theme and keeps it in sync when that changes, so the page needs no theme code: don't add a theme toggle, and don't show the page twice for the two themes. Do not theme with `ThemeSwitcher` or a wrapper `<div data-wb-theme>`. Modals, dropdown menus, popovers, tooltips and calendars render in a portal on `<body>` and would lose the theme. WB tokens are the page's only color source, so you don't need separate `:root` dark-mode color tokens.

**Icons.**
- Get an icon with `await icon("name")`. Names are Phosphor names plus a weight suffix: `gear-bold`, `star-fill`, `magnifying-glass` (regular has no suffix). Check one with a request to `https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/<name>/+esm`, which must return 200.
- These props take the string directly: Button `startIcon`/`endIcon`, IconButton `icon`, PhosphorIcon `icon`, Banner `icon`.
- These props need an element instead, so wrap the string: ``html`<${PhosphorIcon} icon=${myIcon} />` ``. That applies to Link `startIcon`/`endIcon`, Badge/StatusBadge/NeutralBadge `icon` (DueBadge, GemBadge and StreakBadge take `showIcon` instead), Switch `icon`, Tabs item `icon`, and cell `leftAccessory`/`rightAccessory`.
- GemBadge and StreakBadge have no `icon` prop; they use `showIcon`.
- Never import `@phosphor-icons/core/....svg` or use `https://` image URLs. The sandbox allows only `data:` images.

**Props that are easy to get wrong:**
- Required: Tabs `aria-label` (or `aria-labelledby`); SingleSelect `placeholder`; IconButton `aria-label`; Tooltip `placement` (e.g. `"top"`); CircularSpinner `size`.
- `Card` has no `style`; use `styles=${ {root: {...}} }` plus `paddingSize`, `elevation` or `background`.
- `Pill` text goes in `children`.
- `Switch` has no label. Pair it with ``html`<${BodyText} tag="label" htmlFor="x">…</${BodyText}>` `` and give the Switch `id="x"`.
- `LabeledField` takes the control in `field=${…}` and passes `id`, `error` and aria props to it itself, so don't set `error` on the field by hand. It suits TextField, TextArea, SingleSelect, MultiSelect, SearchField and DatePicker. BirthdayPicker has no `id`, so give it a plain label.
- `Accordion` `children` must be an array: two or more `AccordionSection`s, or wrap a single one in `[…]`.
- `DatePicker` dates are Temporal objects. Load `const { Temporal } = await import(NPM + "temporal-polyfill@0.3.2/+esm")` (this exact version, the one WB uses) and pass `Temporal.PlainDate.from("2026-11-23")`.
- An ActionMenu `opener` is a function that returns an element: ``opener=${() => html`<${IconButton} icon=${dots} aria-label="More" kind="tertiary" />`}``. Don't give it its own `onClick`; ActionMenu adds the click and aria props.
- Popover: wrap the trigger as `${({ open }) => html`<${Button} onClick=${open}>…</${Button}>`}`. `PopoverContent` takes `title` and `content` as strings.
- ModalLauncher `modal` is an OnePaneDialog element, or `${({ closeModal }) => html`<${OnePaneDialog} …/>`}` when the footer needs to close it. For a controlled modal, pass `opened` and `onClose`. Put `onClose` on the `ModalLauncher`, never on the `OnePaneDialog` inside it: WB throws when the dialog has its own `onClose`, and the page crashes the moment the modal opens.
- GemBadge/StreakBadge with `showIcon` and no `label` need `iconAriaLabel`.
- `CompactCell` has only a `title`; use `DetailCell` (`subtitle1`, `subtitle2`) when you need subtitles.
- A Tooltip wrapping an element that is already focusable (Button, IconButton) can take `forceAnchorFocusivity=${false}`.

**Text size.** Keep `html { font-size: 62.5%; }` from the skeleton: WB sizes are `rem` on a 10px root, so `1.6rem` is 16px. Don't change the root size or set your own text sizes in raw `px`/`rem`; use WB Typography (`BodyText`, `Heading`) or the `--wb-font-*-size-*` variables. Text outside a WB component inherits the body's 16px.

**Layout.** `View` is a flex column. Use your own CSS classes for grids or wrapping rows (`display:flex; flex-wrap:wrap; gap: var(--wb-sizing-size_160)`). `Strut` is a fixed `size` in px and doesn't wrap. Sizing tokens are `--wb-sizing-size_0`, `_010`, `_020`, `_040`, `_060`, `_080`, `_100`, `_120`, `_140`, `_160`, `_180`, `_200`, `_220`, `_240`, `_260`, `_280`, `_320`, `_360`, `_400`, `_440`, `_480`, `_560`, `_640`, `_720`, `_800`, `_880` and `_960` (the number is px × 10). The core color tokens are `--wb-semanticColor-core-{background-base|foreground-neutral|border-neutral}-{subtle|default|strong}`. Status colors follow the same pattern with `success`, `critical`, `warning` or `instructive` in place of `neutral` (e.g. `--wb-semanticColor-core-foreground-success-default`). Fonts are `--wb-font-family-sans`, `--wb-font-weight-bold` and so on. A big figure can be a styled `<span>`.

**Environment.**
- There is no router, so don't import react-router. WB's Button and Link load a router-compat module internally; that's handled and works without a Router. For in-page actions use a Button. Give a Link a hash `href` such as `"#all-units"`; WB's Link doesn't let `onClick` prevent navigation.
- Load each WB package once, from the `V` versions. Don't add other React libraries: one with its own React copy breaks hooks, and the boot's duplicate check will stop the page.
- `fetch` is blocked. Put data inline in the script.
- DatePicker's calendar CSS loads automatically.

## 5. If it fails

The boot shows any load error on the page in red. The common ones:

- `wonder-blocks-X has no export "Y"`: fix the import using the lines in section 2.
- `Failed to fetch dynamically imported module …/@phosphor-icons/core@…/<weight>/<name>.svg/+esm`: a WB package uses an internal icon the import map doesn't cover yet. Add `"…that URL…": "https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/<name>/+esm"`.
- `A second React copy loaded`: add the listed `react@X/` or `react-dom@X/` prefix to the import map, pointing at the `@18.2.0/` URL.
- Minified React error #130 (an element type is undefined): an import name is wrong, or an element-type icon prop got a plain string.
