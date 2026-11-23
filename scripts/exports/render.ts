/**
 * The DESIGN.md template language. Templates are plain Markdown with token
 * references that get replaced by values from the installed tokens package:
 *
 *   {{tb:semanticColor.core.background.base.default}}   thunderblocks value
 *   {{dark:semanticColor.core.background.base.default}} syl-dark value
 *   {{tb:font.family.sans | first}}                     first font family
 *   {{name:semanticColor.core.border.neutral.subtle}}   the CSS variable name
 *   {{meta:tokensVersion}} / {{meta:tokensMajor}}       installed tokens version
 *
 * In YAML front matter, every reference must sit inside a double-quoted
 * scalar (`primary: "{{tb:…}}"`), so templates stay valid YAML and values
 * containing `#`, `,` or quotes can't silently change the parsed data.
 */
import {isDeepStrictEqual} from "node:util";
import {LineCounter, parseDocument, visit} from "yaml";

import {varName} from "./tokens.ts";
import type {Themes} from "./tokens.ts";

export type RenderContext = {
    themes: Themes;
    meta: Record<string, string>;
};

const REF = /\{\{(tb|dark|meta|name):([\w.-]+)(?:\s*\|\s*(\w+))?\}\}/g;
const NEAR_MISS = /\{\{\s*(tb|dark|meta|name)\b/;
const FENCE = /^\s*(```|~~~)/;

export class TemplateError extends Error {}

/** Renders one template. Throws a TemplateError listing every problem. */
export function render(
    source: string,
    file: string,
    ctx: RenderContext,
    provenance?: string,
): string {
    const errors: string[] = [];
    const lines = source.split("\n");
    const fmEnd = frontMatterEnd(lines);

    let inFence = false;
    const out = lines.map((line, i) => {
        const where = `${file}:${i + 1}`;
        const inFrontMatter = fmEnd !== -1 && i > 0 && i < fmEnd;
        if (!inFrontMatter && FENCE.test(line)) {
            inFence = !inFence;
        }
        const errorsBefore = errors.length;
        const rendered = substitute(
            line,
            ctx,
            (msg) => errors.push(`${where}: ${msg}`),
            inFrontMatter ? escapeDoubleQuoted : (v) => v,
        );
        // Unknown refs are left in place, so only look for malformed ones
        // when this line had no other errors.
        const leftover = errors.length === errorsBefore &&
            (inFence ? NEAR_MISS.test(rendered) : rendered.includes("{{"));
        if (leftover) {
            errors.push(`${where}: malformed or unknown template reference`);
        }
        return rendered;
    });

    if (fmEnd !== -1) {
        checkFrontMatter(lines, out, fmEnd, file, ctx, errors);
        if (provenance && errors.length === 0) {
            out.splice(1, 0, `# ${provenance}`);
        }
    }

    if (errors.length > 0) {
        throw new TemplateError(errors.join("\n"));
    }
    return out.join("\n");
}

/** Index of the closing `---` line, or -1 when there's no front matter. */
function frontMatterEnd(lines: Array<string>): number {
    if (lines[0] !== "---") {
        return -1;
    }
    return lines.indexOf("---", 1);
}

function substitute(
    text: string,
    ctx: RenderContext,
    onError: (msg: string) => void,
    escape: (value: string) => string,
): string {
    return text.replace(
        REF,
        (match, kind: string, tokenPath: string, filter?: string) => {
            const value = lookup(kind, tokenPath, ctx);
            if (value === undefined) {
                onError(`unknown token "${kind}:${tokenPath}"`);
                return match;
            }
            if (filter === undefined) {
                return escape(value);
            }
            if (filter === "first") {
                return escape(firstFamily(value));
            }
            onError(`unknown filter "${filter}" in ${match}`);
            return match;
        },
    );
}

function lookup(
    kind: string,
    tokenPath: string,
    ctx: RenderContext,
): string | undefined {
    switch (kind) {
        case "tb":
            return ctx.themes.thunderblocks.get(varName(tokenPath));
        case "dark":
            return ctx.themes["syl-dark"].get(varName(tokenPath));
        case "name": {
            const name = varName(tokenPath);
            return ctx.themes.thunderblocks.has(name) ? name : undefined;
        }
        case "meta":
            return ctx.meta[tokenPath];
        default:
            return undefined;
    }
}

function firstFamily(value: string): string {
    return value.split(",")[0].trim().replace(/^["']|["']$/g, "");
}

function escapeDoubleQuoted(value: string): string {
    return JSON.stringify(value).slice(1, -1);
}

/**
 * Front matter must survive substitution unchanged in structure: every
 * reference is inside a double-quoted scalar, the output parses cleanly, and
 * the parsed output equals the parsed template with references replaced.
 */
function checkFrontMatter(
    templateLines: Array<string>,
    outputLines: Array<string>,
    fmEnd: number,
    file: string,
    ctx: RenderContext,
    errors: Array<string>,
): void {
    // An unquoted `{{…}}` parses as a YAML flow map, which the scalar check
    // below can't see, so first check each reference's line directly: it
    // must follow an odd number of unescaped double quotes.
    for (let i = 1; i < fmEnd; i++) {
        for (const match of templateLines[i].matchAll(REF)) {
            const before = templateLines[i].slice(0, match.index);
            const quotes = before.replace(/\\./g, "").split('"').length - 1;
            if (quotes % 2 === 0) {
                errors.push(
                    `${file}:${i + 1}: front-matter references must be inside a double-quoted string`,
                );
            }
        }
    }
    if (errors.length > 0) {
        return;
    }

    const templateYaml = templateLines.slice(1, fmEnd).join("\n");
    const lineCounter = new LineCounter();
    const templateDoc = parseDocument(templateYaml, {lineCounter});
    if (templateDoc.errors.length > 0) {
        for (const e of templateDoc.errors) {
            errors.push(`${file}: invalid YAML front matter: ${e.message}`);
        }
        return;
    }

    visit(templateDoc, {
        Scalar(_, node) {
            if (
                typeof node.value === "string" &&
                node.value.includes("{{") &&
                node.type !== "QUOTE_DOUBLE"
            ) {
                const offset = node.range?.[0] ?? 0;
                const line = lineCounter.linePos(offset).line + 1;
                errors.push(
                    `${file}:${line}: front-matter references must be inside a double-quoted string`,
                );
            }
        },
    });
    if (errors.length > 0) {
        return;
    }

    const outputDoc = parseDocument(outputLines.slice(1, fmEnd).join("\n"));
    if (outputDoc.errors.length > 0) {
        for (const e of outputDoc.errors) {
            errors.push(`${file}: rendered front matter is invalid YAML: ${e.message}`);
        }
        return;
    }

    const expected = substituteLeaves(templateDoc.toJS(), ctx);
    if (!isDeepStrictEqual(outputDoc.toJS(), expected)) {
        errors.push(
            `${file}: rendered front matter doesn't match the template's structure`,
        );
    }
}

function substituteLeaves(value: unknown, ctx: RenderContext): unknown {
    if (typeof value === "string") {
        return substitute(value, ctx, () => {}, (v) => v);
    }
    if (Array.isArray(value)) {
        return value.map((v) => substituteLeaves(v, ctx));
    }
    if (value !== null && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, substituteLeaves(v, ctx)]),
        );
    }
    return value;
}
