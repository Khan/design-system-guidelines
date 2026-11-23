/**
 * The second export: the Claude "Wonder Blocks" Design System.
 *
 *   exports/src/** + exports/src/claude-design-system/* + the installed tokens
 *     → exports/claude-design-system/project/**   (the system's files, committed)
 *     → exports/claude-design-system/publish.json  (what the publish skill needs: asset uploads, index keys)
 *
 * The layout under project/ is the Claude "Design System" artifact type's
 * (read its SKILL.md and format.md): README.md is the brand book, other root
 * *.md files are sections, tokens.json uses the type's list grammar, and each
 * components/<Comp>/ holds a README.md and a live preview.html.
 *
 * There is no compiled component bundle. Previews and consumers load the real
 * Wonder Blocks components from jsDelivr with the boot in
 * guides/claude-artifact.md, so `libraries` is [] and every preview is that
 * guide's page skeleton with a small app spliced in.
 *
 * Nothing here talks to Claude. `.claude/skills/publish-design-system/` reads
 * these files from git at origin/main and publishes them.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {parse as parseYaml} from "yaml";

import {kitchenSink, readVersions, skeleton} from "./artifact.ts";
import {TemplateError, render} from "./render.ts";
import type {RenderContext} from "./render.ts";
import {buildTokensJson, compileTokensCss} from "./tokens-json.ts";
import type {UsageNotes} from "./tokens-json.ts";
import {listFiles} from "./tree.ts";

/** Where the generator's own Claude sources live, under exports/src/. */
export const CLAUDE_SRC = "claude-design-system";

const REPO = "Khan/design-system-guidelines";
const RAW_DOCS = `https://raw.githubusercontent.com/${REPO}/main/__docs__/`;
const STORYBOOK = "https://khan.github.io/design-system-guidelines/?path=/docs/";
const LINK = /\[([^\]]*)\]\(([^)\s]+)\)/g;
const FENCE = /^\s*(```|~~~)/;
const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const IMPORT_LINE = /^const \{ (.+) \} = await wb\("([\w-]+)"\);$/;

type AssetGroupConfig = {src: string; name: string; tile: string; readme: string};
type SystemConfig = {title: string; assetGroups: Array<AssetGroupConfig>};
type ComponentConfig = {
    name: string;
    group: string;
    height: number;
    summary: string;
    use: Array<string>;
    rules: Array<string>;
    docs: Array<string>;
    /** "<package in V> <path in dist/>"; omitted for a pattern card. */
    types?: string;
    /**
     * A DSG pattern built from WB parts, such as a progress bar or a chart:
     * Wonder Blocks has no component for it yet.
     */
    pattern?: boolean;
    /** Constants read from a DSG example file at build time, so the card can't drift from the docs. */
    values?: {from: string; names: Array<string>};
    imports: Array<string>;
    icons?: Record<string, string>;
    state?: string;
    render: string;
};

export type Upload = {group: string; name: string; key: string; path: string; type: string; size: number};
export type PublishManifest = {
    generatedFrom: string;
    title: string;
    editing: "code";
    libraries: Array<never>;
    groups: Array<string>;
    assetGroups: Record<string, {name: string; tile: string; order: Array<string>}>;
    uploads: Array<Upload>;
    versions: {tokens: string; cdn: Record<string, string>};
};

export type ClaudeOptions = {
    /** exports/src */
    srcDir: string;
    /** __docs__, for checking and titling the DSG pages components link to */
    docsDir: string;
    ctx: Omit<RenderContext, "target">;
    /** Used in messages, e.g. "exports/src". */
    srcLabel: string;
};

/**
 * Builds every file of the Claude export in memory, keyed by its path under
 * exports/claude-design-system/. Throws a TemplateError listing every problem.
 */
export function buildClaude(options: ClaudeOptions): Map<string, string | Buffer> {
    const {srcDir, docsDir, srcLabel} = options;
    const ctx: RenderContext = {...options.ctx, target: "claude"};
    const errors: Array<string> = [];
    const out = new Map<string, string | Buffer>();
    const readYaml = <T>(name: string): T =>
        parseYaml(fs.readFileSync(path.join(srcDir, CLAUDE_SRC, name), "utf8")) as T;
    const system = readYaml<SystemConfig>("system.yaml");
    const notes = readYaml<UsageNotes>("token-usage.yaml");
    const components = readYaml<Array<ComponentConfig>>("components.yaml");

    // --- Where each source file lands in project/ ---------------------------
    const pathMap = new Map<string, string>();
    pathMap.set("DESIGN.md", "README.md");
    pathMap.set("assets/index.md", "asset-catalog.md");
    const sources = listFiles(srcDir).filter((rel) => !rel.startsWith(`${CLAUDE_SRC}/`));
    for (const rel of sources) {
        const guide = rel.match(/^guides\/([^/]+\.md)$/);
        if (guide) {
            pathMap.set(rel, guide[1]);
        }
    }
    const groupBySrc = new Map(system.assetGroups.map((g) => [g.src, g]));
    const uploads: Array<Upload> = [];
    for (const rel of sources.filter((r) => r.startsWith("assets/") && !r.endsWith(".md"))) {
        const [, src, ...rest] = rel.split("/");
        const group = groupBySrc.get(src);
        if (!group || rest.length === 0) {
            errors.push(`${srcLabel}/${rel}: not in an asset group; add its folder to ${CLAUDE_SRC}/system.yaml`);
            continue;
        }
        const name = rest.join("/");
        const target = `assets/${group.name}/${name}`;
        pathMap.set(rel, target);
        const bytes = fs.readFileSync(path.join(srcDir, rel));
        out.set(`project/${target}`, bytes);
        uploads.push({group: group.name, name, key: assetKey(name), path: `project/${target}`, type: mediaType(rel), size: bytes.length});
    }

    // --- Brand book and sections ---------------------------------------------
    const rendered = new Map<string, string>();
    for (const [rel, target] of pathMap) {
        if (!rel.endsWith(".md")) {
            continue;
        }
        const label = `${srcLabel}/${rel}`;
        try {
            let text = render(fs.readFileSync(path.join(srcDir, rel), "utf8").replace(/\r\n/g, "\n"), label, ctx);
            text = stripFrontMatter(text).replace(/^\n+/, "");
            text = rewriteLinks(text, rel, target, pathMap, label, errors);
            rendered.set(rel, text);
            out.set(`project/${target}`, text.endsWith("\n") ? text : `${text}\n`);
        } catch (e) {
            if (!(e instanceof TemplateError)) {
                throw e;
            }
            errors.push(e.message);
        }
    }
    for (const group of system.assetGroups) {
        out.set(
            `project/assets/${group.name}/README.md`,
            `# ${group.name}\n\n${group.readme.trim()}\n\n` +
                "These are uploads: to get one, read `project/design-system.json`, take " +
                `\`assetGroups.${group.name}.files["<name>"].blob\`, and \`read\` that id as the path. ` +
                "In an artifact, inline the SVG or use a `data:` URI.\n",
        );
    }

    // --- Tokens --------------------------------------------------------------
    let tokenNames = new Set<string>();
    try {
        const tokens = buildTokensJson(ctx.themes, {title: system.title, tokensVersion: ctx.meta.tokensVersion, notes});
        out.set("project/tokens.json", `${JSON.stringify(tokens, null, 2)}\n`);
        out.set("project/tokens.css", compileTokensCss(tokens));
        tokenNames = new Set([
            ...[tokens.color, tokens.spacing, tokens.radius, tokens.shadow, tokens.borderWidth].flatMap((f) => f.tokens.map((t) => t.name)),
            ...Object.keys(tokens.type.families).map((k) => `font-${k}`),
        ]);
    } catch (e) {
        errors.push(`${srcLabel}/${CLAUDE_SRC}/token-usage.yaml: ${(e as Error).message}`);
    }

    // --- Cover ---------------------------------------------------------------
    const cover = fs.readFileSync(path.join(srcDir, CLAUDE_SRC, "cover.html"), "utf8");
    for (const [, name] of cover.matchAll(/var\(--([\w.-]+)\)/g)) {
        if (tokenNames.size > 0 && !tokenNames.has(name)) {
            errors.push(`${srcLabel}/${CLAUDE_SRC}/cover.html: var(--${name}) isn't a token in tokens.json`);
        }
    }
    if (!/^<!-- @dsCard height=\d+ -->\n/.test(cover)) {
        errors.push(`${srcLabel}/${CLAUDE_SRC}/cover.html: line 1 must be <!-- @dsCard height=N -->`);
    }
    out.set("project/components/Cover/preview.html", cover);

    // --- Components ----------------------------------------------------------
    const guideSrc = fs.readFileSync(path.join(srcDir, "guides/claude-artifact.md"), "utf8");
    const versions = readVersions(guideSrc);
    const guideOut = rendered.get("guides/claude-artifact.md");
    const imports = guideSrc.slice(guideSrc.indexOf("## 2."), guideSrc.indexOf("## 3."));
    const seen = new Set<string>();
    for (const c of components) {
        const where = `${srcLabel}/${CLAUDE_SRC}/components.yaml: ${c.name}`;
        if (!IDENT.test(c.name) || c.name === "Cover" || seen.has(c.name)) {
            errors.push(`${where}: name must be a unique identifier other than Cover`);
        }
        seen.add(c.name);
        for (const line of c.imports) {
            const m = line.match(IMPORT_LINE);
            if (!m || !versions[m[2]]) {
                errors.push(`${where}: import "${line}" must load a package pinned in the guide's V`);
            } else if (!imports.includes(line)) {
                errors.push(`${where}: import "${line}" isn't in section 2 of guides/claude-artifact.md`);
            }
        }
        if (c.types) {
            const [typesPkg, typesPath] = c.types.split(" ");
            if (!versions[typesPkg] || !typesPath) {
                errors.push(`${where}: types must be "<package in V> <path>"`);
            }
        } else if (!c.pattern) {
            errors.push(`${where}: types is required unless the card is a pattern`);
        }
        let values: Array<DocValue> = [];
        if (c.values) {
            try {
                values = readDocValues(docsDir, c.values.from, c.values.names);
            } catch (e) {
                errors.push(`${where}: ${(e as Error).message}`);
            }
        }
        const docs = c.docs.map((rel) => {
            const title = docTitle(docsDir, rel);
            if (!title) {
                errors.push(`${where}: __docs__/${rel} doesn't exist or has no <Meta title>`);
            }
            return {rel, title: title ?? rel};
        });
        out.set(`project/components/${c.name}/README.md`, componentReadme(c, docs, versions, values));
        if (guideOut) {
            out.set(`project/components/${c.name}/preview.html`, componentPreview(c, skeleton(guideOut), values));
        }
    }

    // --- Card index at the end of the README, so agents can find cards by path ---
    const readme = out.get("project/README.md");
    if (typeof readme === "string") {
        const rows = components.map((c) => `| ${c.name} | ${c.group} | \`components/${c.name}/README.md\` | ${c.summary.replace(/\|/g, "\\|")} |`);
        out.set(
            "project/README.md",
            `${readme.trimEnd()}\n\n## Component cards\n\n` +
                "Each card's README has its import line, the rules that are easy to get wrong, and where its props live; read it by path before you use the component. " +
                "A component without a card is still loadable: its import line is in section 2 of the [Claude artifact guide](claude-artifact.md).\n\n" +
                `| Card | Group | Read | What it's for |\n| --- | --- | --- | --- |\n${rows.join("\n")}\n`,
        );
    }

    // --- Type limits ---------------------------------------------------------
    const sections = [...out.keys()].filter((k) => /^project\/[^/]+\.md$/.test(k));
    if (sections.length > 24) {
        errors.push(`the Design System type shows at most 24 sections; this build has ${sections.length}`);
    }
    const caps: Array<[RegExp, number]> = [
        [/^project\/README\.md$/, 200_000],
        [/^project\/components\/[^/]+\/README\.md$/, 64_000],
        [/^project\/components\/[^/]+\/preview\.html$/, 256_000],
        [/^project\/tokens\.json$/, 512_000],
    ];
    for (const [rel, content] of out) {
        const cap = caps.find(([re]) => re.test(rel))?.[1];
        if (cap && Buffer.byteLength(content) > cap) {
            errors.push(`${rel} is ${Buffer.byteLength(content)} bytes; the type's cap is ${cap}`);
        }
    }

    if (errors.length > 0) {
        throw new TemplateError(errors.join("\n"));
    }

    const manifest: PublishManifest = {
        generatedFrom: `${srcLabel} by scripts/exports/claude.ts; edit the sources, then run pnpm exports`,
        title: system.title,
        editing: "code",
        libraries: [],
        groups: system.assetGroups.map((g) => g.name),
        assetGroups: Object.fromEntries(
            system.assetGroups.map((g) => [
                g.name,
                {name: g.name, tile: g.tile, order: uploads.filter((u) => u.group === g.name).map((u) => u.name)},
            ]),
        ),
        uploads,
        versions: {tokens: ctx.meta.tokensVersion, cdn: versions},
    };
    out.set("publish.json", `${JSON.stringify(manifest, null, 2)}\n`);
    return out;
}

function stripFrontMatter(text: string): string {
    if (!text.startsWith("---\n")) {
        return text;
    }
    const end = text.indexOf("\n---\n", 4);
    return end === -1 ? text : text.slice(end + 5);
}

/** Re-points relative links from source paths to where those files land in project/. */
function rewriteLinks(
    text: string,
    srcRel: string,
    targetRel: string,
    pathMap: Map<string, string>,
    label: string,
    errors: Array<string>,
): string {
    let inFence = false;
    return text
        .split("\n")
        .map((line) => {
            if (FENCE.test(line)) {
                inFence = !inFence;
                return line;
            }
            if (inFence) {
                return line;
            }
            return line.replace(LINK, (match, label: string, href: string) => {
                if (/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) {
                    return match;
                }
                const [file, anchor] = href.split("#");
                const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(srcRel), file));
                const mapped = pathMap.get(resolved);
                if (!mapped) {
                    errors.push(`${label}: link "${href}" points at a file the Claude export doesn't include`);
                    return match;
                }
                let rel = path.posix.relative(path.posix.dirname(targetRel), mapped);
                if (rel === "") {
                    rel = path.posix.basename(mapped);
                }
                const target = `${rel}${anchor !== undefined ? `#${anchor}` : ""}`;
                // A link whose text is its own path shows the new path too.
                return `[${label === href ? target : label}](${target})`;
            });
        })
        .join("\n");
}

/** The asset record key: the name with bytes outside [A-Za-z0-9_./-] written ~XX. */
export function assetKey(name: string): string {
    return [...Buffer.from(name, "utf8")]
        .map((b) => {
            const ch = String.fromCharCode(b);
            return /[A-Za-z0-9_./-]/.test(ch) ? ch : `~${b.toString(16).padStart(2, "0")}`;
        })
        .join("");
}

function mediaType(rel: string): string {
    const ext = path.extname(rel).toLowerCase();
    const types: Record<string, string> = {
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".pdf": "application/pdf",
        ".mp4": "video/mp4",
    };
    const type = types[ext];
    if (!type) {
        throw new TemplateError(`${rel}: no media type for "${ext}"; the Design System type uploads only images, video and PDF`);
    }
    return type;
}

export type DocValue = {name: string; value: string | number | Record<string, string | number>; comment: string};

const DOC_CONST = (name: string) => new RegExp(`^const ${name} = (.+);$`, "m");

/**
 * Reads top-level `const NAME = <literal>;` lines from a DSG example file under
 * __docs__/: a string, a number, or a flat object of them. Anything else, or a
 * missing name, throws, so a docs edit that moves a value fails `pnpm exports`
 * instead of leaving the card stale. Each value carries the `//` comment block
 * above its group of constants.
 */
export function readDocValues(docsDir: string, rel: string, names: Array<string>): Array<DocValue> {
    const file = path.join(docsDir, rel);
    if (!fs.existsSync(file)) {
        throw new Error(`values.from: __docs__/${rel} doesn't exist`);
    }
    const src = fs.readFileSync(file, "utf8");
    const lines = src.split("\n");
    return names.map((name) => {
        const m = src.match(DOC_CONST(name));
        if (!m) {
            throw new Error(`__docs__/${rel} has no top-level one-line \`const ${name} = …;\``);
        }
        const literal = m[1].trim();
        let value: DocValue["value"];
        try {
            value = JSON.parse(
                literal.startsWith("{") ? literal.replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":') : literal,
            );
        } catch {
            throw new Error(`__docs__/${rel}: const ${name} must be a string, a number, or a flat object of them; it's \`${literal}\``);
        }
        const flat = (v: unknown) => typeof v === "string" || typeof v === "number";
        if (!flat(value) && !(typeof value === "object" && value !== null && !Array.isArray(value) && Object.values(value).every(flat))) {
            throw new Error(`__docs__/${rel}: const ${name} must be a string, a number, or a flat object of them`);
        }
        // Walk up past neighbouring constants to the comment block above the group.
        let i = lines.findIndex((l) => l.startsWith(`const ${name} = `)) - 1;
        while (i >= 0 && /^const [A-Z_]+ = .+;$/.test(lines[i])) {
            i--;
        }
        const comment: Array<string> = [];
        while (i >= 0 && lines[i].startsWith("//")) {
            comment.unshift(lines[i].replace(/^\/\/\s?/, ""));
            i--;
        }
        return {name, value, comment: comment.join(" ")};
    });
}

/** A DSG page's Storybook title, from its <Meta title="…" />. */
function docTitle(docsDir: string, rel: string): string | undefined {
    const file = path.join(docsDir, rel);
    if (!rel.endsWith(".mdx") || !fs.existsSync(file)) {
        return undefined;
    }
    return fs.readFileSync(file, "utf8").match(/<Meta\s+title="([^"]+)"/)?.[1];
}

/** Storybook's id for a docs title: "Design Guidelines / Components / Buttons / Buttons" → design-guidelines-components-buttons-buttons. */
export function storyId(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function componentReadme(
    c: ComponentConfig,
    docs: Array<{rel: string; title: string}>,
    versions: Record<string, string>,
    values: Array<DocValue> = [],
): string {
    const lines = [
        `# ${c.name}`,
        "",
        c.summary,
        "",
        ...(c.pattern
            ? [
                  "**A pattern, not a Wonder Blocks component.** Wonder Blocks has no component for this yet,",
                  "so build it from the WB parts below, the way this card's preview does. The design",
                  "guidelines linked at the end define it; the preview follows the DSG's own example.",
                  "",
              ]
            : []),
        "## Load it",
        "",
        "In a Claude artifact or prototype, start from the page skeleton in the",
        `[Claude artifact guide](../../claude-artifact.md), then load ${c.pattern ? "the parts" : "the package"}:`,
        "",
        "```js",
        ...c.imports,
        "```",
        "",
        "## When to use it",
        "",
        ...c.use.map((u) => `- ${u}`),
        "",
        "## Get these right",
        "",
        ...c.rules.map((r) => `- ${r}`),
    ];
    if (values.length > 0 && c.values) {
        lines.push(
            "",
            "## Values",
            "",
            "Read from the DSG's example source at build time",
            `([\`${c.values.from.split("/").at(-1)}\`](${RAW_DOCS}${c.values.from})), so they match the docs.`,
            "Use these exact values; the preview declares them the same way.",
            "",
            "| Constant | Value | Note |",
            "| --- | --- | --- |",
            ...values.map(
                (v) => `| \`${v.name}\` | \`${JSON.stringify(v.value).replace(/"(\w+)":/g, "$1: ")}\` | ${v.comment.replace(/\|/g, "\\|")} |`,
            ),
        );
    }
    if (c.types) {
        const [pkg, typesPath] = c.types.split(" ");
        lines.push(
            "",
            "## Props",
            "",
            "Read the props from the package's types at the pinned version, never from",
            `memory: <https://cdn.jsdelivr.net/npm/@khanacademy/wonder-blocks-${pkg}@${versions[pkg]}/${typesPath}>.`,
            "Section 3 of the Claude artifact guide lists where other components' props live.",
        );
    } else {
        lines.push(
            "",
            "## Props",
            "",
            "Each part's props are in its package's types; section 3 of the Claude artifact guide says where.",
        );
    }
    if (docs.length > 0) {
        lines.push(
            "",
            "## Guidelines",
            "",
            "The design guidelines for this component are linked, not copied here, and win over",
            "anything above. Read the source (Markdown) or the rendered page:",
            "",
            ...docs.map((d) => {
                const name = d.title.split("/").at(-1)!.trim();
                return `- ${name}: [source](${RAW_DOCS}${d.rel}), [page](${STORYBOOK}${storyId(d.title)}--docs)`;
            }),
        );
    }
    return `${lines.join("\n")}\n`;
}

/** Layout helpers every preview can use; colors and spacing come from WB tokens. */
const PREVIEW_CSS =
    "<style>\n" +
    "  .row { display: flex; flex-wrap: wrap; gap: var(--wb-sizing-size_120); align-items: center; }\n" +
    "  .row.top { align-items: flex-start; }\n" +
    "  .stack { display: flex; flex-direction: column; gap: var(--wb-sizing-size_120); }\n" +
    "  .narrow { max-width: 360px; }\n" +
    "  .text { margin: 0; }\n" +
    "  .pad-top { padding-top: var(--wb-sizing-size_480); }\n" +
    "  #root { padding-top: var(--wb-sizing-size_160); padding-bottom: var(--wb-sizing-size_160); }\n" +
    "</style>\n";

/** The guide's page skeleton with this component's app spliced in after the boot. */
export function componentPreview(c: ComponentConfig, skel: string, values: Array<DocValue> = []): string {
    const parsed = c.imports.map((line) => line.match(IMPORT_LINE)!);
    const unique = [...new Map(parsed.map((m) => [m[0], m])).values()];
    const icons = Object.entries(c.icons ?? {});
    const app = [
        "  // This card's app; everything above is the boot from the Claude artifact guide, verbatim.",
        `  const [${unique.map((m) => `{ ${m[1]} }`).join(", ")}] = await Promise.all([${unique.map((m) => `wb("${m[2]}")`).join(", ")}]);`,
        ...(icons.length > 0
            ? [`  const [${icons.map(([k]) => k).join(", ")}] = await Promise.all([${icons.map(([, v]) => `icon("${v}")`).join(", ")}]);`]
            : []),
        "  const dupes = performance.getEntriesByType(\"resource\").map((e) => e.name).filter((n) => /\\/npm\\/react(-dom)?@(?!18\\.2\\.0\\/)/.test(n));",
        "  if (dupes.length) throw new Error(\"A second React copy loaded. Add a prefix mapping to react@18.2.0 in the import map for:\\n\" + dupes.join(\"\\n\"));",
        ...(values.length > 0
            ? [`  // From __docs__/${c.values!.from}, read at build time.`, ...values.map((v) => `  const ${v.name} = ${JSON.stringify(v.value)};`)]
            : []),
        "",
        "  function App() {",
        ...(c.state ? c.state.trim().split("\n").map((l) => `    ${l}`) : []),
        "    return html`",
        ...c.render.trimEnd().split("\n").map((l) => `      ${l}`),
        "    `;",
        "  }",
        "  createRoot(document.getElementById(\"root\")).render(html`<${App} />`);",
    ].join("\n");
    const page = kitchenSink(skel, app).replace(
        /<title>[^<]*<\/title>/,
        `<title>${c.name} — Wonder Blocks</title>`,
    );
    const split = page.indexOf('<div id="root">');
    return (
        `<!-- @dsCard group="${c.group}" height=${c.height} -->\n` +
        "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n" +
        page.slice(0, split) +
        PREVIEW_CSS +
        "</head>\n<body>\n" +
        page.slice(split).replace(/\n*$/, "\n") +
        "</body>\n</html>\n"
    );
}
