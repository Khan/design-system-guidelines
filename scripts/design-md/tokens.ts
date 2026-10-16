/**
 * Reads the Wonder Blocks tokens CSS (`@khanacademy/wonder-blocks-tokens/styles.css`)
 * and returns fully resolved values per theme.
 *
 * The WB JS exports resolve to "var(--wb-...)" strings, so the only place
 * concrete per-theme values exist in the published package is its CSS. Each
 * theme is a flat block of custom properties, repeated once per WB package,
 * scoped by `data-wb-theme`.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {createRequire} from "node:module";

export type ThemeName = "thunderblocks" | "syl-dark";
export type ThemeValues = Map<string, string>;
export type Themes = Record<ThemeName, ThemeValues>;

const DEFAULT_SELECTOR = ":root, [data-wb-theme='default']";
const THEME_SELECTORS: Record<ThemeName, string> = {
    "thunderblocks": "[data-wb-theme='thunderblocks']",
    "syl-dark": "[data-wb-theme='syl-dark']",
};

/** WB tokens use rem on a 10px root (see `remToPx` in wonder-blocks-tokens). */
const REM_BASE_PX = 10;

/**
 * Parses the tokens CSS into resolved values for each theme.
 *
 * Themes are layered default → thunderblocks → syl-dark (mirroring
 * `mergeTheme` in the WB source), `var()` references are resolved within a
 * theme, and values are normalized: rem → px, hex → uppercase.
 */
export function parseThemes(css: string): Themes {
    if (/\/\*/.test(css) || /(^|[{};\s])@[a-z-]+/i.test(css)) {
        throw new Error(
            "tokens CSS contains comments or @-rules; the flat parser in scripts/design-md/tokens.ts needs updating",
        );
    }

    const raw = new Map<string, Map<string, string>>();
    for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const key = selector.trim();
        const vars = raw.get(key) ?? new Map<string, string>();
        for (const decl of body.split(";")) {
            const colon = decl.indexOf(":");
            if (colon === -1) {
                continue;
            }
            const name = decl.slice(0, colon).trim();
            if (name.startsWith("--")) {
                vars.set(name, decl.slice(colon + 1).trim());
            }
        }
        raw.set(key, vars);
    }

    const base = raw.get(DEFAULT_SELECTOR);
    const thunderblocks = raw.get(THEME_SELECTORS.thunderblocks);
    const sylDark = raw.get(THEME_SELECTORS["syl-dark"]);
    if (!base || !thunderblocks || !sylDark) {
        throw new Error(
            "tokens CSS is missing one of the default, thunderblocks, or syl-dark theme blocks",
        );
    }

    const tbRaw = new Map([...base, ...thunderblocks]);
    const darkRaw = new Map([...tbRaw, ...sylDark]);
    return {
        "thunderblocks": resolveTheme(tbRaw),
        "syl-dark": resolveTheme(darkRaw),
    };
}

function resolveTheme(rawVars: Map<string, string>): ThemeValues {
    const resolved = new Map<string, string>();
    const resolving = new Set<string>();

    const resolve = (name: string): string => {
        const cached = resolved.get(name);
        if (cached !== undefined) {
            return cached;
        }
        const value = rawVars.get(name);
        if (value === undefined) {
            throw new Error(`Unknown CSS variable referenced: ${name}`);
        }
        if (resolving.has(name)) {
            throw new Error(
                `Cycle in CSS variables: ${[...resolving, name].join(" → ")}`,
            );
        }
        resolving.add(name);
        const substituted = value.replace(
            /var\(\s*(--[\w-]+)\s*\)/g,
            (_, ref: string) => resolve(ref),
        );
        resolving.delete(name);
        if (substituted.includes("var(")) {
            throw new Error(`Unresolved var() in ${name}: ${substituted}`);
        }
        const normalized = normalize(name, substituted);
        resolved.set(name, normalized);
        return normalized;
    };

    for (const name of rawVars.keys()) {
        resolve(name);
    }
    return resolved;
}

function normalize(name: string, value: string): string {
    let result = value.replace(/#[0-9a-f]{3,8}\b/gi, (hex) => hex.toUpperCase());

    const rem = result.match(/^(-?[\d.]+)rem$/);
    if (rem) {
        const px = Number(rem[1]) * REM_BASE_PX;
        // Round away float error (e.g. 0.3 * 10), but refuse real fractions.
        const rounded = Math.round(px * 1000) / 1000;
        if (!Number.isInteger(rounded)) {
            throw new Error(
                `${name} converts to a fractional pixel value (${value} → ${rounded}px)`,
            );
        }
        result = `${rounded}px`;
    }
    return result;
}

/** Converts a dotted token path to its CSS variable name. */
export function varName(tokenPath: string): string {
    return `--wb-${tokenPath.split(".").join("-")}`;
}

export type LoadedTokens = {
    tokensVersion: string;
    css: string;
};

/** Reads the installed tokens package's CSS and version. */
export function loadTokens(): LoadedTokens {
    const require = createRequire(import.meta.url);
    const cssPath = require.resolve(
        "@khanacademy/wonder-blocks-tokens/styles.css",
    );
    // The package's `exports` map doesn't expose package.json, so find it
    // relative to the CSS file (dist/css/index.css).
    const pkgPath = path.join(path.dirname(cssPath), "../../package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as {
        name: string;
        version: string;
    };
    if (pkg.name !== "@khanacademy/wonder-blocks-tokens") {
        throw new Error(`Expected tokens package.json at ${pkgPath}`);
    }
    return {
        tokensVersion: pkg.version,
        css: fs.readFileSync(cssPath, "utf8"),
    };
}
