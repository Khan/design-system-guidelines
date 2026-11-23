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
 *
 * Lines that only one export needs go in a target block, each marker on a
 * line of its own (not in front matter, not nested):
 *
 *   {{#target claude}}
 *   Only in the Claude Design System.
 *   {{/target}}
 *
 * Targets are listed in TARGETS; an unknown name fails the build.
 */
import {isDeepStrictEqual} from "node:util";
import {LineCounter, parseDocument, visit} from "yaml";

import {varName} from "./tokens.ts";
import type {Themes} from "./tokens.ts";

/** The exports one template can render into. */
export const TARGETS = ["design-md", "claude"] as const;
export type Target = (typeof TARGETS)[number];

export type RenderContext = {
    themes: Themes;
    meta: Record<string, string>;
    /** Which export is being rendered. Defaults to "design-md". */
    target?: Target;
};

const REF = /\{\{(tb|dark|meta|name):([\w.-]+)(?:\s*\|\s*(\w+))?\}\}/g;
const NEAR_MISS = /\{\{\s*(tb|dark|meta|name)\b/;
const FENCE = /^\s*(```|~~~)/;
const TARGET_OPEN = /^\{\{#target\s+([\w-]*)\s*\}\}$/;
const TARGET_CLOSE = /^\{\{\/target\}\}$/;
const TARGET_NEAR_MISS = /\{\{\s*[#/]\s*target\b/;

export class TemplateError extends Error {}

/**
 * Which lines belong to `target`: false for marker lines and for lines inside
 * another target's block. Reports unknown targets, nesting, stray or unclosed
 * markers, markers in front matter, and markers that aren't alone on a line.
 */
function targetMask(
    lines: Array<string>,
    file: string,
    target: Target,
    fmEnd: number,
    errors: Array<string>,
): Array<boolean> {
    const keep: Array<boolean> = [];
    let open: {name: string; line: number} | null = null;
    lines.forEach((line, i) => {
        const where = `${file}:${i + 1}`;
        const trimmed = line.trim();
        const opening = trimmed.match(TARGET_OPEN);
        const closing = TARGET_CLOSE.test(trimmed);
        if (opening || closing) {
            if (fmEnd !== -1 && i <= fmEnd) {
                errors.push(`${where}: target blocks aren't allowed in front matter`);
            } else if (opening) {
                const name = opening[1];
                if (!(TARGETS as ReadonlyArray<string>).includes(name)) {
                    errors.push(
                        `${where}: unknown target "${name}" (known: ${TARGETS.join(", ")})`,
                    );
                }
                if (open) {
                    errors.push(
                        `${where}: target blocks can't nest (block opened at line ${open.line})`,
                    );
                }
                open = {name, line: i + 1};
            } else if (!open) {
                errors.push(`${where}: {{/target}} without an opening {{#target …}}`);
            } else {
                open = null;
            }
            keep.push(false);
            return;
        }
        if (TARGET_NEAR_MISS.test(line)) {
            errors.push(`${where}: target markers must be alone on their line, as {{#target name}} or {{/target}}`);
        }
        keep.push(open === null || open.name === target);
    });
    if (open) {
        errors.push(`${file}:${(open as {line: number}).line}: {{#target …}} is never closed`);
    }
    return keep;
}

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
    const target = ctx.target ?? "design-md";
    if (!(TARGETS as ReadonlyArray<string>).includes(target)) {
        throw new TemplateError(`${file}: unknown render target "${target}"`);
    }
    const keep = targetMask(lines, file, target, fmEnd, errors);

    let inFence = false;
    const out: Array<string> = [];
    lines.forEach((line, i) => {
        if (!keep[i]) {
            return;
        }
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
        out.push(rendered);
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
