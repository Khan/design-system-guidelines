/**
 * Generates the published DESIGN.md files.
 *
 *   design-md/src/**\/*.md        (templates, edited by hand)
 *     → design-md/published/**\/*.md  (committed output, served at /design-md/)
 *
 * Any other file under src/ (e.g. assets/*.svg) is copied as-is.
 *
 * Every template is rendered and validated in memory first; files on disk
 * change only if all of them succeed, so a failed run never leaves a
 * half-written design-md/published/ directory.
 *
 * Usage: pnpm design-md
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {fileURLToPath} from "node:url";

import {TemplateError, render} from "./render.ts";
import {loadTokens, parseThemes} from "./tokens.ts";

export type GenerateOptions = {
    srcDir: string;
    outDir: string;
    css: string;
    tokensVersion: string;
    /** Used in the provenance comment, e.g. "design-md/src". */
    srcLabel?: string;
};

export type GenerateResult = {
    written: Array<string>;
    deleted: Array<string>;
    unchanged: Array<string>;
};

export function generate(options: GenerateOptions): GenerateResult {
    const {srcDir, outDir, css, tokensVersion} = options;
    const srcLabel = options.srcLabel ?? path.basename(srcDir);
    const ctx = {
        themes: parseThemes(css),
        meta: {
            tokensVersion,
            tokensMajor: tokensVersion.split(".")[0],
        },
    };

    const sources = listFiles(srcDir);
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
                `Generated from ${srcLabel}/${rel}: edit that file, then run pnpm design-md`,
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

    const result: GenerateResult = {written: [], deleted: [], unchanged: []};
    for (const [rel, content] of rendered) {
        const target = path.join(outDir, rel);
        if (fs.existsSync(target) && fs.readFileSync(target).equals(Buffer.from(content))) {
            result.unchanged.push(rel);
            continue;
        }
        fs.mkdirSync(path.dirname(target), {recursive: true});
        fs.writeFileSync(target, content);
        result.written.push(rel);
    }
    for (const rel of listFiles(outDir)) {
        if (!rendered.has(rel)) {
            fs.rmSync(path.join(outDir, rel));
            result.deleted.push(rel);
        }
    }
    return result;
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

/** Sorted, posix-style relative paths of every non-hidden file under `dir`. */
function listFiles(dir: string): Array<string> {
    if (!fs.existsSync(dir)) {
        return [];
    }
    return fs
        .readdirSync(dir, {recursive: true, encoding: "utf8"})
        .filter((rel) => !rel.split(path.sep).some((part) => part.startsWith(".")))
        .filter((rel) => fs.statSync(path.join(dir, rel)).isFile())
        .map((rel) => rel.split(path.sep).join("/"))
        .sort();
}

function main(): void {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
    const {css, tokensVersion} = loadTokens();
    try {
        const result = generate({
            srcDir: path.join(root, "design-md", "src"),
            outDir: path.join(root, "design-md", "published"),
            srcLabel: "design-md/src",
            css,
            tokensVersion,
        });
        console.log(
            `design-md: tokens ${tokensVersion}; ` +
                `${result.written.length} written, ` +
                `${result.unchanged.length} unchanged, ` +
                `${result.deleted.length} deleted`,
        );
        for (const rel of [...result.written, ...result.deleted]) {
            console.log(`  ${result.deleted.includes(rel) ? "-" : "+"} design-md/published/${rel}`);
        }
    } catch (e) {
        if (e instanceof TemplateError) {
            console.error(`design-md: generation failed; nothing was written.\n${e.message}`);
            process.exit(1);
        }
        throw e;
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}
