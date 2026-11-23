// Kitchen-sink app for `pnpm artifact:preview kitchen-sink`.
// It's spliced in after the guide's "end WB boot" line, so it runs with the boot exactly as published
// (React, html, wb, icon, setTheme, initialTheme and NPM are in scope). It renders every component in the
// guide's import list so a Wonder Blocks bump can be checked in one page: no red error box, window.__errs
// empty, and modal / menus / popover / tooltip / calendar themed in both themes.
  const [
    { default: Button }, { default: IconButton }, { PhosphorIcon }, { Heading, BodyText }, { View }, { Strut },
    { Card }, { default: Pill }, { StatusBadge, NeutralBadge, DueBadge, GemBadge, StreakBadge }, { default: Banner },
    { TextField, TextArea, Checkbox, CheckboxGroup, RadioGroup, Choice }, { default: Switch },
    { SingleSelect, MultiSelect, OptionItem, ActionMenu, ActionItem },
    { ModalLauncher, OnePaneDialog }, { Popover, PopoverContent }, { default: Tooltip }, { default: Toolbar },
    { Tabs }, { Accordion, AccordionSection }, { Breadcrumbs, BreadcrumbsItem }, { default: Link },
    { CircularSpinner }, { CompactCell, DetailCell }, { default: SearchField }, { DatePicker },
    { default: BirthdayPicker }, { LabeledField }, { Temporal },
  ] = await Promise.all([
    wb("button"), wb("icon-button"), wb("icon"), wb("typography"), wb("core"), wb("layout"),
    wb("card"), wb("pill"), wb("badge"), wb("banner"), wb("form"), wb("switch"), wb("dropdown"),
    wb("modal"), wb("popover"), wb("tooltip"), wb("toolbar"), wb("tabs"), wb("accordion"), wb("breadcrumbs"),
    wb("link"), wb("progress-spinner"), wb("cell"), wb("search-field"), wb("date-picker"),
    wb("birthday-picker"), wb("labeled-field"), import(`${NPM}temporal-polyfill@0.3.2/+esm`),
  ]);
  const [plusIcon, gearIcon, starIcon, bookIcon] = await Promise.all([icon("plus-bold"), icon("gear-bold"), icon("star-fill"), icon("book-open")]);

  const dupes = performance.getEntriesByType("resource").map((e) => e.name).filter((n) => /\/npm\/react(-dom)?@(?!18\.2\.0\/)/.test(n));
  if (dupes.length) throw new Error("A second React copy loaded. Add a prefix mapping to react@18.2.0 in the import map for:\n" + dupes.join("\n"));

  function App() {
    const [theme, setThemeState] = React.useState(initialTheme);
    React.useEffect(() => setTheme(theme), [theme]);
    const [tab, setTab] = React.useState("a");
    const [sel, setSel] = React.useState(null);
    const [multi, setMulti] = React.useState([]);
    const [text, setText] = React.useState("ab");
    const [notes, setNotes] = React.useState("");
    const [search, setSearch] = React.useState("");
    const [checked, setChecked] = React.useState(true);
    const [subjects, setSubjects] = React.useState(["math"]);
    const [on, setOn] = React.useState(true);
    const [radio, setRadio] = React.useState("a");
    const [date, setDate] = React.useState(Temporal.PlainDate.from("2026-11-23"));
    const [log, setLog] = React.useState("—");
    const row = { display: "flex", flexWrap: "wrap", gap: "var(--wb-sizing-size_120)", alignItems: "center" };
    return html`
      <${View} style=${{ gap: 16, paddingBlock: 16 }}>
        <${Toolbar} title="Kitchen sink" subtitle=${theme} rightContent=${html`<${Button} kind="secondary" size="small" onClick=${() => setThemeState(theme === "thunderblocks" ? "syl-dark" : "thunderblocks")}>Toggle theme</${Button}>`} />
        <${Breadcrumbs}><${BreadcrumbsItem}><${Link} href="#math">Math</${Link}></${BreadcrumbsItem}><${BreadcrumbsItem}>Algebra 1</${BreadcrumbsItem}></${Breadcrumbs}>
        <${Heading} size="xlarge" tag="h1">Every component</${Heading}>
        <${BodyText}>Last action: ${log}</${BodyText}>
        <${Banner} kind="info" text="Banner with built-in icon and dismiss" onDismiss=${() => setLog("banner dismissed")} />
        <div style=${row}>
          <${Button} startIcon=${plusIcon} onClick=${() => setLog("primary")}>Primary</${Button}>
          <${Button} kind="secondary" onClick=${() => setLog("secondary")}>Secondary</${Button}>
          <${Button} kind="tertiary" onClick=${() => setLog("tertiary")}>Tertiary</${Button}>
          <${Tooltip} content="Tooltip on an IconButton" placement="top" forceAnchorFocusivity=${false}>
            <${IconButton} icon=${gearIcon} aria-label="Settings" onClick=${() => setLog("icon button")} />
          </${Tooltip}>
          <${PhosphorIcon} icon=${starIcon} size="medium" />
          <${Pill} kind="accent">Pill</${Pill}>
          <${StatusBadge} kind="success" label="Complete" />
          <${NeutralBadge} label="Neutral" />
          <${DueBadge} kind="due" label="Due Fri" />
          <${GemBadge} showIcon=${true} label="340" />
          <${StreakBadge} showIcon=${true} label="12-day streak" />
          <${CircularSpinner} size="small" light=${false} />
        </div>
        <div style=${row}>
          <${Popover} content=${html`<${PopoverContent} title="Popover" content="Portaled popover body" closeButtonVisible=${true} />`}>
            ${({ open }) => html`<${Button} kind="secondary" onClick=${open}>Open popover</${Button}>`}
          </${Popover}>
          <${ModalLauncher} modal=${({ closeModal }) => html`<${OnePaneDialog} title="Modal" content=${html`<${BodyText}>Portaled modal body</${BodyText}>`} footer=${html`<${Button} onClick=${closeModal}>Done</${Button}>`} />`}>
            ${({ openModal }) => html`<${Button} onClick=${openModal}>Open modal</${Button}>`}
          </${ModalLauncher}>
          <${SingleSelect} placeholder="Single select" selectedValue=${sel} onChange=${setSel}><${OptionItem} label="One" value="1" /><${OptionItem} label="Two" value="2" /></${SingleSelect}>
          <${MultiSelect} selectedValues=${multi} onChange=${setMulti}><${OptionItem} label="Red" value="r" /><${OptionItem} label="Blue" value="b" /></${MultiSelect}>
          <${ActionMenu} menuText="Actions"><${ActionItem} label="Edit" onClick=${() => setLog("edit")} /><${ActionItem} label="Delete" onClick=${() => setLog("delete")} /></${ActionMenu}>
        </div>
        <div style=${{ display: "flex", flexWrap: "wrap" }}>
          <${Card}><${BodyText}>Card one</${BodyText}></${Card}>
          <${Strut} size=${16} />
          <${Card} paddingSize="small" elevation="low"><${BodyText}>Card two</${BodyText}></${Card}>
        </div>
        <${Tabs} aria-label="Sample tabs" selectedTabId=${tab} onTabSelected=${setTab} tabs=${[
          { id: "a", label: "Tab A", panel: html`<${BodyText}>Panel A</${BodyText}>` },
          { id: "b", label: "Tab B", panel: html`<${BodyText}>Panel B</${BodyText}>` },
        ]} />
        <${Accordion}>${[
          html`<${AccordionSection} key="1" header="Section one">Content one</${AccordionSection}>`,
          html`<${AccordionSection} key="2" header="Section two">Content two</${AccordionSection}>`,
        ]}</${Accordion}>
        <${LabeledField} label="Username" description="At least 3 characters" errorMessage=${text.length < 3 ? "Too short" : undefined} field=${html`<${TextField} value=${text} onChange=${setText} />`} />
        <${LabeledField} label="Notes" field=${html`<${TextArea} value=${notes} onChange=${setNotes} />`} />
        <${LabeledField} label="Search" field=${html`<${SearchField} value=${search} onChange=${setSearch} placeholder="Search" />`} />
        <${LabeledField} label="Start date" field=${html`<${DatePicker} selectedDate=${date} updateDate=${setDate} />`} />
        <${BodyText}>Birthday</${BodyText}>
        <${BirthdayPicker} onChange=${() => {}} />
        <div style=${row}>
          <${Checkbox} label="Checkbox" checked=${checked} onChange=${setChecked} />
          <${BodyText} tag="label" htmlFor="ks-switch">Switch</${BodyText}>
          <${Switch} id="ks-switch" checked=${on} onChange=${setOn} />
        </div>
        <${RadioGroup} groupName="ks-radio" label="Radio group" selectedValue=${radio} onChange=${setRadio}><${Choice} label="A" value="a" /><${Choice} label="B" value="b" /></${RadioGroup}>
        <${CheckboxGroup} groupName="ks-subjects" label="Checkbox group" selectedValues=${subjects} onChange=${setSubjects}><${Choice} label="Math" value="math" /><${Choice} label="Science" value="science" /></${CheckboxGroup}>
        <${CompactCell} title="Compact cell" leftAccessory=${html`<${PhosphorIcon} icon=${bookIcon} />`} onClick=${() => setLog("compact cell")} />
        <${DetailCell} title="Detail cell" subtitle1="Subtitle one" subtitle2="Subtitle two" />
      </${View}>`;
  }
  createRoot(document.getElementById("root")).render(html`<${App} />`);
