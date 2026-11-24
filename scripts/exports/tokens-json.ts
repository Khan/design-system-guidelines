/**
 * Builds the Claude Design System's `tokens.json` (and the `tokens.css` the
 * page would compile from it) from the resolved Wonder Blocks themes.
 *
 * The Design System type reads a LIST grammar, `{tokens: [{name, value,
 * usage}]}` per family, with colors carrying a value per theme. The first
 * theme is the fallback, so `thunderblocks` (light) comes first and
 * `syl-dark` second. Every token needs a usage note; notes come from
 * `exports/src/claude-design-system/token-usage.yaml`, matched by the longest
 * token-path prefix, and a token without one fails the build.
 *
 * Names drop the `--wb-` (and, for colors, `semanticColor-`) prefix, because
 * the type caps names at 64 characters. Each usage note names the real CSS
 * variable, which is what code should use.
 */
import type {Themes} from "./tokens.ts";

export type TokenEntry = {name: string; value: string | Record<string, string>; usage: string};
export type TypeStyle = {name: string; fontSize: string; lineHeight: string; fontWeight: number; usage: string};
export type TokensJson = {
    name: string;
    version: 1;
    meta: Record<string, unknown>;
    color: {themes: Array<{id: string; name: string}>; tokens: Array<TokenEntry>};
    type: {
        fonts: Array<never>;
        families: Record<string, string>;
        groups: Array<{name: string; family: string; styles: Array<TypeStyle>}>;
    };
    spacing: {tokens: Array<TokenEntry>};
    radius: {tokens: Array<TokenEntry>};
    shadow: {tokens: Array<TokenEntry>};
    borderWidth: {tokens: Array<TokenEntry>};
};

/** Usage notes keyed by token-path prefix (e.g. "semanticColor.core.background"). */
export type UsageNotes = Record<string, string>;

/** Theme ids are light/dark so the page's `data-theme` maps straight onto WB's themes. */
export const THEMES = [
    {id: "light", name: "Light (thunderblocks)", wb: "thunderblocks"},
    {id: "dark", name: "Dark (syl-dark)", wb: "syl-dark"},
] as const;

const NAME = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/;
const HEX = /^#[0-9A-Fa-f]{3,8}$/;
const RGBA = /^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(,\s*[\d.]+\s*)?\)$/;
// The only color-mix WB uses: a hex faded toward transparent. In sRGB that is
// exactly the hex at that alpha (color-mix premultiplies), which the type can read.
const FADE = /color-mix\(in srgb,\s*(#[0-9A-Fa-f]{6})\s+([\d.]+)%,\s*transparent\)/g;

/** Rewrites WB color syntax the type can't read into exact equivalents it can. */
export function toTypeColor(value: string, where: string): string {
    const v = value.trim().replace(FADE, (_, hex: string, pct: string) => fade(hex, pct));
    if (v === "transparent") {
        return "#00000000";
    }
    if (HEX.test(v) || RGBA.test(v)) {
        return HEX.test(v) ? v.toLowerCase() : v;
    }
    throw new Error(`${where}: "${value}" isn't a color the Design System type can read; teach toTypeColor() about it`);
}

/** The same rewrite inside a box-shadow string. */
export function toTypeShadow(value: string, where: string): string {
    const v = value.replace(FADE, (_, hex: string, pct: string) => fade(hex, pct));
    if (/var\(|color-mix|url\(/.test(v) || v.length > 400) {
        throw new Error(`${where}: shadow "${value}" can't be expressed for the Design System type`);
    }
    return v;
}

function fade(hex: string, pct: string): string {
    const n = parseInt(hex.slice(1), 16);
    const alpha = Number(pct) / 100;
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/** The usage note for a token path: the longest matching prefix, plus the CSS variable. */
export function usageFor(tokenPath: string, notes: UsageNotes): string | undefined {
    const parts = tokenPath.split(".");
    for (let i = parts.length; i > 0; i--) {
        const note = notes[parts.slice(0, i).join(".")];
        if (note !== undefined) {
            return `${note.trim()} CSS: \`var(--wb-${parts.join("-")})\`.`;
        }
    }
    return undefined;
}

/** Splits a resolved theme into token paths (dotted) under one prefix, in source order. */
function pathsUnder(themes: Themes, prefix: string): Array<string> {
    const cssPrefix = `--wb-${prefix.split(".").join("-")}-`;
    return [...themes.thunderblocks.keys()]
        .filter((name) => name.startsWith(cssPrefix))
        .map((name) => `${prefix}.${name.slice(cssPrefix.length).split("-").join(".")}`);
}

// Page order for colors: what most work needs first. Source order within a family.
const COLOR_FAMILIES = ["core", "action", "input", "feedback", "status", "focus", "link", "khanmigo", "mastery", "graphics", "learning", "chonky"];
const familyRank = (p: string) => {
    const i = COLOR_FAMILIES.indexOf(p.split(".")[1]);
    return i === -1 ? COLOR_FAMILIES.length : i;
};
const byFamily = (a: string, b: string) => familyRank(a) - familyRank(b);

const cssVar = (tokenPath: string) => `--wb-${tokenPath.split(".").join("-")}`;

export type TokensJsonOptions = {
    title: string;
    tokensVersion: string;
    notes: UsageNotes;
};

export function buildTokensJson(themes: Themes, options: TokensJsonOptions): TokensJson {
    const {notes} = options;
    const errors: Array<string> = [];
    const seen = new Set<string>();
    const tb = themes.thunderblocks;
    const dark = themes["syl-dark"];

    const entry = (tokenPath: string, name: string, value: TokenEntry["value"]): TokenEntry => {
        if (!NAME.test(name)) {
            errors.push(`${tokenPath}: token name "${name}" doesn't fit the type's name rules`);
        }
        if (seen.has(name)) {
            errors.push(`${tokenPath}: token name "${name}" is used twice`);
        }
        seen.add(name);
        const usage = usageFor(tokenPath, notes);
        if (usage === undefined) {
            errors.push(`${tokenPath}: no usage note; add a prefix for it to token-usage.yaml`);
        }
        return {name, value, usage: usage ?? ""};
    };
    const guard = <T>(fn: () => T, fallback: T): T => {
        try {
            return fn();
        } catch (e) {
            errors.push((e as Error).message);
            return fallback;
        }
    };

    const colors = pathsUnder(themes, "semanticColor").sort(byFamily).map((p) => {
        const name = p.slice("semanticColor.".length).split(".").join("-");
        const v = cssVar(p);
        return entry(p, name, {
            light: guard(() => toTypeColor(tb.get(v)!, p), ""),
            dark: guard(() => toTypeColor(dark.get(v)!, p), ""),
        });
    });
    const plain = (prefix: string, rename: (p: string) => string) =>
        pathsUnder(themes, prefix).map((p) => entry(p, rename(p), tb.get(cssVar(p))!));
    const last = (p: string) => p.split(".").at(-1)!;

    const spacing = plain("sizing", last);
    const radius = plain("border.radius", last);
    const borderWidth = plain("border.width", (p) => `border-width-${last(p)}`);
    const shadow = pathsUnder(themes, "boxShadow").map((p) =>
        entry(p, `shadow-${last(p)}`, {
            light: guard(() => toTypeShadow(tb.get(cssVar(p))!, p), ""),
            dark: guard(() => toTypeShadow(dark.get(cssVar(p))!, p), ""),
        }),
    );

    const family = (key: string) => tb.get(`--wb-font-family-${key}`)!;
    const style = (group: "heading" | "body", size: string, weight: string): TypeStyle => {
        const p = `font.${group}.size.${size}`;
        const usage = usageFor(p, notes);
        if (usage === undefined) {
            errors.push(`${p}: no usage note; add a prefix for it to token-usage.yaml`);
        }
        return {
            name: `${group}-${size}`,
            fontSize: tb.get(cssVar(p))!,
            lineHeight: tb.get(cssVar(`font.${group}.lineHeight.${size}`))!,
            fontWeight: Number(tb.get(`--wb-font-weight-${weight}`)),
            usage: usage ?? "",
        };
    };
    const px = (p: string) => parseFloat(tb.get(cssVar(p))!);
    const sizes = (group: "heading" | "body") =>
        pathsUnder(themes, `font.${group}.size`).sort((a, b) => px(b) - px(a)).map(last);

    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }
    return {
        name: options.title,
        version: 1,
        meta: {
            source: "github",
            repo: "Khan/design-system-guidelines",
            generator: "scripts/exports/tokens-json.ts",
            tokensPackage: `@khanacademy/wonder-blocks-tokens@${options.tokensVersion}`,
            note: "Generated from the thunderblocks and syl-dark themes. Change it in the repo, not on the page.",
        },
        color: {themes: THEMES.map(({id, name}) => ({id, name})), tokens: colors},
        type: {
            fonts: [],
            // Hosted on Google Fonts, so no font files: the type names them here only.
            families: {sans: family("sans"), mono: family("mono"), serif: family("serif")},
            groups: [
                {name: "Headings", family: "sans", styles: sizes("heading").map((s) => style("heading", s, "bold"))},
                {name: "Body", family: "sans", styles: sizes("body").map((s) => style("body", s, "medium"))},
            ],
        },
        spacing: {tokens: spacing},
        radius: {tokens: radius},
        shadow: {tokens: shadow},
        borderWidth: {tokens: borderWidth},
    };
}

/**
 * The page's own `tokens.css` layout (format.md, "tokens.css as compiled").
 * A system whose index says `"editing": "code"` never saves from the page, so
 * whoever syncs it writes this file. Line 1 marks it as generated.
 */
export function compileTokensCss(tokens: TokensJson): string {
    const [first, ...rest] = tokens.color.themes.map((t) => t.id);
    const themed = [...tokens.color.tokens, ...tokens.shadow.tokens];
    const valueIn = (t: TokenEntry, theme: string) =>
        typeof t.value === "string" ? t.value : (t.value[theme] ?? t.value[first]);
    const decls = (list: Array<TokenEntry>, theme: string) =>
        list.map((t) => `  --${t.name}: ${valueIn(t, theme)};`).join("\n");
    const out = [`/* ${tokens.name} — generated from tokens.json */`];
    out.push(`:root, [data-theme="${first}"] {\n${decls(themed, first)}\n}`);
    for (const theme of rest) {
        const changed = themed.filter((t) => valueIn(t, theme) !== valueIn(t, first));
        out.push(`[data-theme="${theme}"] {\n${decls(changed, theme)}\n}`);
    }
    const fixed = [...tokens.spacing.tokens, ...tokens.radius.tokens, ...tokens.borderWidth.tokens];
    const families = Object.entries(tokens.type.families).map(([k, v]) => `  --font-${k}: ${v};`);
    out.push(`:root {\n${decls(fixed, first)}\n${families.join("\n")}\n}`);
    for (const group of tokens.type.groups) {
        for (const s of group.styles) {
            out.push(
                `.${s.name} { font-family: var(--font-${group.family}); font-size: ${s.fontSize}; ` +
                    `line-height: ${s.lineHeight}; font-weight: ${s.fontWeight}; }`,
            );
        }
    }
    return `${out.join("\n")}\n`;
}
