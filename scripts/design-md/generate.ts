/**
 * Generates the published DESIGN.md files.
 *
 *   design-md-src/**\/*.md  (templates, edited by hand)
 *     → design-md/**\/*.md  (committed output, served at /design-md/)
 *
 * Every template is rendered and validated in memory first; files on disk
 * change only if all of them succeed, so a failed run never leaves a
 * half-written design-md/ directory.
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
    /** Used in the provenance comment, e.g. "design-md-src". */
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

    const templates = listMarkdown(srcDir);
    if (templates.length === 0) {
        throw new Error(`No templates found in ${srcDir}`);
    }

    const rendered = new Map<string, string>();
    const errors: Array<string> = [];
    for (const rel of templates) {
        const source = fs.readFileSync(path.join(srcDir, rel), "utf8");
        try {
            const output = render(
                source.replace(/\r\n/g, "\n"),
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
        if (fs.existsSync(target) && fs.readFileSync(target, "utf8") === content) {
            result.unchanged.push(rel);
            continue;
        }
        fs.mkdirSync(path.dirname(target), {recursive: true});
        fs.writeFileSync(target, content);
        result.written.push(rel);
    }
    for (const rel of listMarkdown(outDir)) {
        if (!rendered.has(rel)) {
            fs.rmSync(path.join(outDir, rel));
            result.deleted.push(rel);
        }
    }
    return result;
}

/** Sorted, posix-style relative paths of every .md file under `dir`. */
function listMarkdown(dir: string): Array<string> {
    if (!fs.existsSync(dir)) {
        return [];
    }
    return fs
        .readdirSync(dir, {recursive: true, encoding: "utf8"})
        .filter((rel) => rel.endsWith(".md"))
        .map((rel) => rel.split(path.sep).join("/"))
        .sort();
}

function main(): void {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
    const {css, tokensVersion} = loadTokens();
    try {
        const result = generate({
            srcDir: path.join(root, "design-md-src"),
            outDir: path.join(root, "design-md"),
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
            console.log(`  ${result.deleted.includes(rel) ? "-" : "+"} design-md/${rel}`);
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
