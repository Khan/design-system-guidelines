/**
 * Generates both exports from one source.
 *
 *   exports/src/**\/*.md          (templates, edited by hand)
 *     → exports/design-md/**\/*.md  (DESIGN.md: committed, served at /design-md/)
 *     → exports/claude-design-system/{project/**, publish.json}
 *                                  (the Claude "Wonder Blocks" Design System:
 *                                   committed, published by a skill; see claude.ts)
 *
 * For DESIGN.md, any other file under src/ (e.g. assets/*.svg) is copied
 * as-is. `src/claude-design-system/` holds the Claude export's own sources and
 * isn't part of DESIGN.md.
 *
 * Every template is rendered and validated in memory first, for both
 * exports; files on disk change only if all of them succeed, so a failed run
 * never leaves a half-written output directory.
 *
 * Usage: pnpm exports
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {fileURLToPath} from "node:url";

import {CLAUDE_SRC, buildClaude} from "./claude.ts";
import {TemplateError, render} from "./render.ts";
import {loadTokens, parseThemes} from "./tokens.ts";
import {listFiles, writeTree} from "./tree.ts";
import type {GenerateResult} from "./tree.ts";

export type {GenerateResult};

export type GenerateOptions = {
    srcDir: string;
    outDir: string;
    css: string;
    tokensVersion: string;
    /** Used in the provenance comment, e.g. "exports/src". */
    srcLabel?: string;
};

/** Renders and writes DESIGN.md (exports/design-md/). */
export function generate(options: GenerateOptions): GenerateResult {
    return writeTree(options.outDir, buildDesignMd(options));
}

function context(css: string, tokensVersion: string) {
    return {
        themes: parseThemes(css),
        meta: {
            tokensVersion,
            tokensMajor: tokensVersion.split(".")[0],
        },
    };
}

/** Every DESIGN.md output file, in memory. Throws a TemplateError listing every problem. */
export function buildDesignMd(options: GenerateOptions): Map<string, string | Buffer> {
    const {srcDir, css, tokensVersion} = options;
    const srcLabel = options.srcLabel ?? path.basename(srcDir);
    const ctx = context(css, tokensVersion);

    const sources = listFiles(srcDir).filter((rel) => !rel.startsWith(`${CLAUDE_SRC}/`));
    const templates = sources.filter((rel) => rel.endsWith(".md"));
    if (templates.length === 0) {
        throw new Error(`No templates found in ${srcDir}`);
    }

    const rendered = new Map<string, string | Buffer>();
    const errors: Array<string> = [];
    for (const rel of sources.filter((rel) => !rel.endsWith(".md"))) {
        // Served URLs are case-sensitive but macOS checkouts aren't, so a
        // capitalized or spaced name can work locally and 404 in CI.
        if (!/^[a-z0-9][a-z0-9._/-]*$/.test(rel)) {
            errors.push(`${srcLabel}/${rel}: asset names must be lowercase kebab-case`);
        }
        rendered.set(rel, fs.readFileSync(path.join(srcDir, rel)));
    }
    for (const rel of templates) {
        const source = fs.readFileSync(path.join(srcDir, rel), "utf8").replace(/\r\n/g, "\n");
        errors.push(...checkLinks(source, rel, `${srcLabel}/${rel}`, sources));
        try {
            const output = render(
                source,
                `${srcLabel}/${rel}`,
                ctx,
                `Generated from ${srcLabel}/${rel}: edit that file, then run pnpm exports`,
            );
            rendered.set(rel, output.endsWith("\n") ? output : `${output}\n`);
        } catch (e) {
            if (e instanceof TemplateError) {
                errors.push(e.message);
            } else {
                throw e;
            }
        }
    }
    if (errors.length > 0) {
        throw new TemplateError(errors.join("\n"));
    }
    return rendered;
}

/**
 * The published files are served from several hosts (local Storybook, GitHub
 * Pages, Chromatic), so links between them must be relative: an absolute
 * link would send a reader of one host's copy to another host's. The one
 * exception is the canonical address of the core DESIGN.md, which DESIGN.md
 * states for agents that receive its text without a URL to resolve against.
 */
const CANONICAL_URL = "https://khan.github.io/design-system-guidelines/design-md/DESIGN.md";
const SITE_PREFIX = "khan.github.io/design-system-guidelines/design-md/";
const LINK = /\]\(([^)\s]+)\)/g;
const FENCE = /^\s*(```|~~~)/;

/** Errors for absolute self-links and relative links to files not in src/. */
function checkLinks(
    source: string,
    rel: string,
    label: string,
    sources: Array<string>,
): Array<string> {
    const errors: Array<string> = [];
    let inFence = false;
    source.split("\n").forEach((line, i) => {
        if (FENCE.test(line)) {
            inFence = !inFence;
            return;
        }
        if (inFence) {
            return;
        }
        const where = `${label}:${i + 1}`;
        const selfRefs = line.split(SITE_PREFIX).length - 1;
        const canonical = rel === "DESIGN.md" ? line.split(CANONICAL_URL).length - 1 : 0;
        if (selfRefs > canonical) {
            errors.push(
                `${where}: link to other DESIGN.md files with a relative path, not the published URL`,
            );
        }
        for (const [, href] of line.matchAll(LINK)) {
            if (/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) {
                continue;
            }
            const target = path.posix.normalize(
                path.posix.join(path.posix.dirname(rel), href.split("#")[0]),
            );
            if (!sources.includes(target)) {
                errors.push(`${where}: relative link "${href}" doesn't match any file in src/`);
            }
        }
    });
    return errors;
}

function main(): void {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
    const {css, tokensVersion} = loadTokens();
    const srcDir = path.join(root, "exports", "src");
    try {
        // Build both in memory first, so a failure in either writes nothing.
        const designMd = buildDesignMd({srcDir, outDir: "", srcLabel: "exports/src", css, tokensVersion});
        const claude = buildClaude({
            srcDir,
            docsDir: path.join(root, "__docs__"),
            srcLabel: "exports/src",
            ctx: context(css, tokensVersion),
        });
        const outputs: Array<[string, Map<string, string | Buffer>, (rel: string) => boolean]> = [
            ["exports/design-md", designMd, () => false],
            // config.json beside the output is hand-edited (the published system's URL).
            ["exports/claude-design-system", claude, (rel) => rel === "config.json"],
        ];
        for (const [dir, files, keep] of outputs) {
            const result = writeTree(path.join(root, dir), files, keep);
            console.log(
                `exports: ${dir}: tokens ${tokensVersion}; ` +
                    `${result.written.length} written, ` +
                    `${result.unchanged.length} unchanged, ` +
                    `${result.deleted.length} deleted`,
            );
            for (const rel of [...result.written, ...result.deleted]) {
                console.log(`  ${result.deleted.includes(rel) ? "-" : "+"} ${dir}/${rel}`);
            }
        }
    } catch (e) {
        if (e instanceof TemplateError) {
            console.error(`exports: generation failed; nothing was written.\n${e.message}`);
            process.exit(1);
        }
        throw e;
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}
