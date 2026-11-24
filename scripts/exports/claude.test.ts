/**
 * The Claude Design System export, built from the real exports/src/ and the
 * installed tokens (offline). The staleness of the committed copy is CI's job;
 * these check that what gets built follows the Design System type's format
 * and the repo's rules.
 */
import * as assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import {describe, it} from "node:test";
import {fileURLToPath} from "node:url";

import {skeleton} from "./artifact.ts";
import {assetKey, buildClaude, readDocValues, storyId} from "./claude.ts";
import type {PublishManifest} from "./claude.ts";
import {buildDesignMd} from "./generate.ts";
import {loadTokens, parseThemes} from "./tokens.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const {css, tokensVersion} = loadTokens();
const ctx = {themes: parseThemes(css), meta: {tokensVersion, tokensMajor: tokensVersion.split(".")[0]}};
const srcDir = path.join(ROOT, "exports/src");
const files = buildClaude({srcDir, docsDir: path.join(ROOT, "__docs__"), srcLabel: "exports/src", ctx});
const text = (rel: string) => {
    const v = files.get(rel);
    assert.ok(v !== undefined, `${rel} wasn't built`);
    return v.toString();
};
const manifest = JSON.parse(text("publish.json")) as PublishManifest;
const designMd = buildDesignMd({srcDir, outDir: "", srcLabel: "exports/src", css, tokensVersion});

describe("claude export: brand book and sections", () => {
    const readme = text("project/README.md");

    it("writes the README without front matter, a title or unresolved template syntax", () => {
        assert.ok(!readme.startsWith("---"));
        assert.doesNotMatch(readme, /^# Khan Academy Design/m, "the page shows the system's name; the README has no title");
        for (const [rel, v] of files) {
            if (!rel.endsWith(".md")) continue;
            const prose = v.toString().replace(/^(```|~~~)[\s\S]*?^\1/gm, "");
            assert.doesNotMatch(prose, /\{\{/, `${rel} has leftover {{`);
        }
    });

    it("routes prototypes to the CDN-loader guide, not a bundle", () => {
        assert.match(readme, /\| Prototype, page, or Claude artifact \| The \[Claude artifact guide\]\(claude-artifact\.md\)/);
        assert.match(readme, /no component bundle and no\n`window\.WonderBlocks` global/);
    });

    it("keeps each target's block out of the other export", () => {
        const core = designMd.get("DESIGN.md")!.toString();
        assert.doesNotMatch(core, /Change it in the repo, not here/);
        assert.doesNotMatch(core, /This system's token pages/);
        assert.match(core, /The YAML front matter follows/);
        assert.doesNotMatch(readme, /The YAML front matter follows/);
        assert.doesNotMatch(readme, /\| Claude artifact, or any UI prototype that can load/);
    });

    it("turns the guides and asset catalog into root sections, at most 24", () => {
        const sections = [...files.keys()].filter((k) => /^project\/[^/]+\.md$/.test(k)).sort();
        assert.deepEqual(sections, [
            "project/README.md",
            "project/asset-catalog.md",
            "project/claude-artifact.md",
            "project/diagrams.md",
            "project/product-ui.md",
            "project/slides.md",
            "project/web-prototype.md",
        ]);
    });

    it("re-points every relative link at a file the system has", () => {
        for (const [rel, v] of files) {
            if (!rel.endsWith(".md")) continue;
            let inFence = false;
            for (const line of v.toString().split("\n")) {
                if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
                if (inFence) continue;
                for (const [, href] of line.matchAll(/\]\(([^)\s]+)\)/g)) {
                    if (/^([a-z][a-z0-9+.-]*:|#)/i.test(href)) continue;
                    const target = path.posix.normalize(path.posix.join(path.posix.dirname(rel), href.split("#")[0]));
                    assert.ok(files.has(target), `${rel}: "${href}" → ${target} isn't in the build`);
                }
            }
        }
    });

    it("never copies the data-viz docs, only links them", () => {
        for (const [rel, v] of files) {
            if (rel.endsWith(".md")) assert.doesNotMatch(v.toString(), /^import .* from ["']@storybook/m, rel);
        }
        assert.match(readme, /raw\.githubusercontent\.com\/Khan\/design-system-guidelines\/main\/__docs__\/design-foundations\/data-visualization\.mdx/);
    });
});

describe("claude export: data visualization patterns", () => {
    const docsFile = (rel: string) => fs.readFileSync(path.join(ROOT, "__docs__", rel), "utf8");
    const cases: Array<[string, string, Array<string>]> = [
        ["ProgressBar", "design-components/assets/progress-charts/ProgressExamples.tsx", ["SINGLE", "BEHIND", "MARKER"]],
        ["DistributionChart", "design-components/assets/distribution-charts/AssignmentsCompletedChart.tsx", ["EMPHASIS", "COMPARISON"]],
        ["TrendChart", "design-components/assets/trend-charts/GrowthOverTimeChart.tsx", ["LINE", "FILL"]],
        ["DataTable", "design-components/assets/progress-charts/ProgressExamples.tsx", ["SINGLE"]],
    ];
    for (const [card, from, names] of cases) {
        it(`${card} declares the DSG example's values and lists them`, () => {
            const preview = text(`project/components/${card}/preview.html`);
            const readme = text(`project/components/${card}/README.md`);
            assert.match(readme, /\*\*A pattern, not a Wonder Blocks component\.\*\*/);
            for (const v of readDocValues(path.join(ROOT, "__docs__"), from, names)) {
                assert.ok(preview.includes(`const ${v.name} = ${JSON.stringify(v.value)};`), `${card} preview declares ${v.name}`);
                assert.ok(readme.includes(`| \`${v.name}\` |`), `${card} README lists ${v.name}`);
                for (const hex of JSON.stringify(v.value).match(/#[0-9A-Fa-f]{6}/g) ?? []) {
                    assert.ok(docsFile(from).includes(hex), `${hex} is in ${from}`);
                }
            }
        });
    }

    it("tells agents to follow the pattern cards instead of rebuilding or inventing", () => {
        const readme = text("project/README.md");
        assert.match(readme, /Patterns Wonder Blocks doesn't have yet/);
        assert.match(readme, /Never invent their colors or sizes/);
        assert.doesNotMatch(designMd.get("DESIGN.md")!.toString(), /Patterns Wonder Blocks doesn't have yet/, "Claude-only text stays out of DESIGN.md");
    });
});

describe("claude export: components", () => {
    const comps = [...files.keys()].map((k) => k.match(/^project\/components\/([^/]+)\/preview\.html$/)?.[1]).filter(Boolean) as string[];
    const guide = skeleton(fs.readFileSync(path.join(ROOT, "exports/design-md/guides/claude-artifact.md"), "utf8"));
    const boot = guide.slice(guide.indexOf("// ---------- WB boot"), guide.indexOf("// ---------- end WB boot"));

    it("has a cover plus a README and preview per component", () => {
        assert.ok(comps.includes("Cover"));
        assert.ok(!files.has("project/components/Cover/README.md"), "a README beside the cover turns it into a component");
        assert.ok(comps.length >= 15);
        for (const c of comps.filter((c) => c !== "Cover")) assert.ok(files.has(`project/components/${c}/README.md`), c);
    });

    it("ships no component bundle and loads no libraries", () => {
        assert.ok(![...files.keys()].some((k) => /components\/(bundle\.(js|css)|index\.d\.ts|lib\/)/.test(k)));
        assert.deepEqual(manifest.libraries, []);
        assert.equal(manifest.editing, "code");
    });

    for (const c of ["Button", "Modal", "TextField"]) {
        it(`${c}: starts with the card marker and boots exactly like the guide`, () => {
            const page = text(`project/components/${c}/preview.html`);
            assert.match(page.split("\n")[0], /^<!-- @dsCard group="[^"]+" height=\d+ -->$/);
            assert.ok(page.includes(boot), "the boot differs from guides/claude-artifact.md");
            assert.match(page, /<script type="importmap">[\s\S]*<script type="module">/);
            assert.match(page, /attributeFilter: \["data-theme"\]/);
            assert.doesNotMatch(page, /<iframe|<object|<embed|<noscript/);
        });
    }

    it("loads scripts only from hosts the artifact CSP allows, at pinned versions", () => {
        for (const c of comps) {
            const page = text(`project/components/${c}/preview.html`);
            for (const [url] of page.matchAll(/https:\/\/[^\s"'`)]+/g)) {
                if (url.startsWith("https://fonts.googleapis.com/") || url.startsWith("http://www.w3.org/")) continue;
                assert.ok(url.startsWith("https://cdn.jsdelivr.net/npm/"), `${c}: ${url}`);
            }
            assert.doesNotMatch(page, /@latest|cdn\.jsdelivr\.net\/npm\/[a-z@/-]+\/\+esm/i, c);
        }
    });

    it("cover colors come only from tokens", () => {
        const cover = text("project/components/Cover/preview.html");
        const style = cover.slice(cover.indexOf("<style>"), cover.indexOf("</style>"));
        assert.doesNotMatch(style, /#[0-9a-f]{3,8}\b|rgba?\(/i);
    });
});

describe("claude export: tokens and assets", () => {
    it("writes tokens.json in the list grammar with a note on every token", () => {
        const tokens = JSON.parse(text("project/tokens.json"));
        assert.deepEqual(tokens.color.themes.map((t: {id: string}) => t.id), ["light", "dark"]);
        for (const family of ["color", "spacing", "radius", "shadow", "borderWidth"]) {
            assert.ok(Array.isArray(tokens[family].tokens) && tokens[family].tokens.length > 0, family);
            for (const t of tokens[family].tokens) assert.ok(t.usage, `${family} ${t.name} has no usage`);
        }
        assert.ok(text("project/tokens.css").startsWith("/* Wonder Blocks — generated from tokens.json */"));
    });

    it("lists every asset as an upload in its group, in file order", () => {
        const assets = [...files.keys()].filter((k) => k.startsWith("project/assets/") && !k.endsWith(".md"));
        assert.deepEqual(manifest.uploads.map((u) => u.path).sort(), assets.sort());
        assert.deepEqual(manifest.groups, ["Brand", "Icons", "Shapes"]);
        for (const g of manifest.groups) {
            assert.ok(files.has(`project/assets/${g}/README.md`), `${g} has no README`);
            assert.deepEqual(manifest.assetGroups[g].order, manifest.uploads.filter((u) => u.group === g).map((u) => u.name));
        }
        for (const u of manifest.uploads) assert.equal(u.size, (files.get(u.path) as Buffer).length);
    });

    it("records the WB versions it was built from", () => {
        assert.equal(manifest.versions.tokens, tokensVersion);
        assert.ok(manifest.versions.cdn.button);
    });
});

describe("claude export: helpers", () => {
    it("escapes asset keys the way the type names records", () => {
        assert.equal(assetKey("activities/icon-unit.svg"), "activities/icon-unit.svg");
        assert.equal(assetKey("a b+é.svg"), "a~20b~2b~c3~a9.svg");
    });

    it("derives Storybook ids from docs titles", () => {
        assert.equal(storyId("Design Guidelines / Components / Overlays / Modals - selection"), "design-guidelines-components-overlays-modals-selection");
    });
    it("reads DSG example constants, with the comment above their group", () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), "docvals-"));
        fs.writeFileSync(
            path.join(dir, "Ex.tsx"),
            'import x from "y";\n\n// Role colors until tokens exist.\nconst A = {fill: "#8DA2FF", outline: "#6C82FF"};\nconst B = "#4A4C53";\nconst N = 3;\nconst T = semanticColor.core;\n',
        );
        const [a, b, n] = readDocValues(dir, "Ex.tsx", ["A", "B", "N"]);
        assert.deepEqual(a, {name: "A", value: {fill: "#8DA2FF", outline: "#6C82FF"}, comment: "Role colors until tokens exist."});
        assert.equal(b.value, "#4A4C53");
        assert.equal(b.comment, "Role colors until tokens exist.");
        assert.equal(n.value, 3);
        assert.throws(() => readDocValues(dir, "Ex.tsx", ["T"]), /must be a string, a number, or a flat object/);
        assert.throws(() => readDocValues(dir, "Ex.tsx", ["GONE"]), /has no top-level one-line `const GONE/);
        assert.throws(() => readDocValues(dir, "Missing.tsx", ["A"]), /doesn't exist/);
    });
});
