import * as assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import {afterEach, beforeEach, describe, it} from "node:test";

import {generate} from "./generate.ts";
import {TemplateError, render} from "./render.ts";
import {parseThemes} from "./tokens.ts";

const CSS =
    ":root, [data-wb-theme='default'] {--wb-color-primary: #1865f2;}" +
    "[data-wb-theme='syl-dark'] {--wb-color-primary: #6C82FF; --wb-bg: #252531;}" +
    "[data-wb-theme='thunderblocks'] {" +
    "--wb-color-primary: #5753fa;" +
    "--wb-bg: #FFFFFF;" +
    "--wb-sizing-size_120: 1.2rem;" +
    "--wb-pad: var(--wb-sizing-size_120);" +
    '--wb-font-family-sans: Plus Jakarta Sans, "Noto Sans", sans-serif;' +
    '--wb-font-family-serif: "Noto Serif", serif;' +
    "--wb-shadow: 0 2px 2px 0 color-mix(in srgb, #252368 20%, transparent);" +
    "}";

const ctx = {
    themes: parseThemes(CSS),
    meta: {tokensVersion: "18.0.0", tokensMajor: "18"},
};

const renderBody = (body: string) => render(body, "test.md", ctx);

describe("render: body", () => {
    it("substitutes thunderblocks and syl-dark values", () => {
        // Arrange
        const template = "| {{tb:color.primary}} | {{dark:color.primary}} |";

        // Act
        const output = renderBody(template);

        // Assert
        assert.equal(output, "| #5753FA | #6C82FF |");
    });

    it("emits CSS variable names with name:", () => {
        // Arrange, Act
        const output = renderBody("`{{name:color.primary}}`");

        // Assert
        assert.equal(output, "`--wb-color-primary`");
    });

    it("returns the first font family with quotes stripped", () => {
        // Arrange, Act
        const output = renderBody(
            "{{tb:font.family.sans | first}} / {{tb:font.family.serif | first}}",
        );

        // Assert
        assert.equal(output, "Plus Jakarta Sans / Noto Serif");
    });

    it("renders references inside code fences", () => {
        // Arrange
        const template = "```html\n<link href=\"…tokens@{{meta:tokensMajor}}/…\" />\n```";

        // Act
        const output = renderBody(template);

        // Assert
        assert.match(output, /tokens@18\//);
    });

    it("leaves JSX double braces inside code fences alone", () => {
        // Arrange
        const template = "```tsx\n<View style={{gap: 8}} />\n```";

        // Act
        const output = renderBody(template);

        // Assert
        assert.equal(output, template);
    });

    it("reports an unknown token with file and line", () => {
        // Arrange
        const template = "ok\n{{tb:color.nope}}";

        // Act, Assert
        assert.throws(() => renderBody(template), (e: unknown) => {
            assert.ok(e instanceof TemplateError);
            assert.match(e.message, /test\.md:2: unknown token "tb:color\.nope"/);
            return true;
        });
    });

    it("reports an unknown filter", () => {
        // Arrange, Act, Assert
        assert.throws(() => renderBody("{{tb:color.primary | upper}}"), /unknown filter/);
    });

    it("reports a malformed reference outside fences", () => {
        // Arrange, Act, Assert
        assert.throws(() => renderBody("{{ tb:color.primary}}"), /test\.md:1: malformed/);
    });

    it("reports a near-miss reference inside fences", () => {
        // Arrange
        const template = "```\n@{{ meta:tokensMajor}}\n```";

        // Act, Assert
        assert.throws(() => renderBody(template), /test\.md:2: malformed/);
    });

    it("collects every error in one throw", () => {
        // Arrange
        const template = "{{tb:a}}\n{{tb:b}}";

        // Act, Assert
        assert.throws(() => renderBody(template), (e: unknown) => {
            assert.ok(e instanceof Error);
            assert.equal(e.message.split("\n").length, 2);
            return true;
        });
    });
});

describe("render: front matter", () => {
    const fm = (yaml: string) => `---\n${yaml}\n---\n\n# Title`;

    it("round-trips hex, color-mix, quoted font stacks, and partial strings", () => {
        // Arrange
        const template = fm(
            [
                'primary: "{{tb:color.primary}}"',
                'shadow: "{{tb:shadow}}"',
                'stack: "{{tb:font.family.sans}}"',
                'padding: "0 {{tb:pad}}"',
                'type: { fontFamily: "{{tb:font.family.sans | first}}", fontWeight: 700 }',
            ].join("\n"),
        );

        // Act
        const output = render(template, "test.md", ctx);

        // Assert
        assert.match(output, /^primary: "#5753FA"$/m);
        assert.match(output, /^shadow: "0 2px 2px 0 color-mix\(in srgb, #252368 20%, transparent\)"$/m);
        assert.match(output, /^stack: "Plus Jakarta Sans, \\"Noto Sans\\", sans-serif"$/m);
        assert.match(output, /^padding: "0 12px"$/m);
        assert.match(output, /fontFamily: "Plus Jakarta Sans", fontWeight: 700/);
    });

    it("injects the provenance comment after the opening ---", () => {
        // Arrange
        const template = fm('primary: "{{tb:color.primary}}"');

        // Act
        const output = render(template, "test.md", ctx, "Generated from test.md");

        // Assert
        assert.ok(output.startsWith("---\n# Generated from test.md\nprimary:"));
    });

    for (const [label, line] of [
        ["unquoted", "primary: {{tb:color.primary}}"],
        ["partly unquoted", "padding: 0 {{tb:pad}}"],
        ["single-quoted", "primary: '{{tb:color.primary}}'"],
        ["unquoted in a flow map", "type: { fontFamily: {{tb:font.family.sans | first}} }"],
    ] as const) {
        it(`rejects a ${label} reference`, () => {
            // Arrange
            const template = fm(line);

            // Act, Assert
            assert.throws(
                () => render(template, "test.md", ctx),
                /test\.md:2: front-matter references must be inside a double-quoted string/,
            );
        });
    }
});

describe("generate", () => {
    let tmp: string;

    beforeEach(() => {
        tmp = fs.mkdtempSync(path.join(os.tmpdir(), "exports-"));
        fs.mkdirSync(path.join(tmp, "src/guides"), {recursive: true});
    });

    afterEach(() => {
        fs.rmSync(tmp, {recursive: true, force: true});
    });

    const run = () =>
        generate({
            srcDir: path.join(tmp, "src"),
            outDir: path.join(tmp, "out"),
            css: CSS,
            tokensVersion: "18.0.0",
        });

    it("writes every template and deletes outputs without a template", () => {
        // Arrange
        fs.writeFileSync(path.join(tmp, "src/DESIGN.md"), "{{tb:color.primary}}");
        fs.writeFileSync(path.join(tmp, "src/guides/a.md"), "a");
        fs.mkdirSync(path.join(tmp, "out"));
        fs.writeFileSync(path.join(tmp, "out/stale.md"), "old");

        // Act
        const result = run();

        // Assert
        assert.deepEqual(result.written, ["DESIGN.md", "guides/a.md"]);
        assert.deepEqual(result.deleted, ["stale.md"]);
        assert.equal(fs.readFileSync(path.join(tmp, "out/DESIGN.md"), "utf8"), "#5753FA\n");
    });

    it("is a no-op on a second run", () => {
        // Arrange
        fs.writeFileSync(path.join(tmp, "src/DESIGN.md"), "x");
        run();

        // Act
        const result = run();

        // Assert
        assert.deepEqual(result.written, []);
        assert.deepEqual(result.unchanged, ["DESIGN.md"]);
    });

    it("writes nothing when any template fails", () => {
        // Arrange
        fs.writeFileSync(path.join(tmp, "src/DESIGN.md"), "fine");
        fs.writeFileSync(path.join(tmp, "src/guides/bad.md"), "{{tb:nope}}");
        fs.mkdirSync(path.join(tmp, "out"));
        fs.writeFileSync(path.join(tmp, "out/DESIGN.md"), "previous");

        // Act, Assert
        assert.throws(run, /src\/guides\/bad\.md:1/);
        assert.deepEqual(fs.readdirSync(path.join(tmp, "out")), ["DESIGN.md"]);
        assert.equal(fs.readFileSync(path.join(tmp, "out/DESIGN.md"), "utf8"), "previous");
    });

    it("accepts relative links between templates and the canonical URL", () => {
        // Arrange
        fs.writeFileSync(
            path.join(tmp, "src/DESIGN.md"),
            "<https://khan.github.io/design-system-guidelines/design-md/DESIGN.md>\n" +
                "[a](guides/a.md#top) [ext](https://example.com/x.md) [here](#top)",
        );
        fs.writeFileSync(path.join(tmp, "src/guides/a.md"), "[core](../DESIGN.md) [b](b.md)");
        fs.writeFileSync(path.join(tmp, "src/guides/b.md"), "```\n[not checked](nope.md)\n```");

        // Act
        const result = run();

        // Assert
        assert.equal(result.written.length, 3);
    });

    it("copies non-Markdown files as-is and links to them", () => {
        // Arrange
        fs.mkdirSync(path.join(tmp, "src/assets"));
        fs.writeFileSync(path.join(tmp, "src/assets/logo.svg"), "<svg>{{tb:nope}}</svg>");
        fs.writeFileSync(path.join(tmp, "src/.DS_Store"), "junk");
        fs.writeFileSync(path.join(tmp, "src/DESIGN.md"), "[logo](assets/logo.svg)");
        fs.mkdirSync(path.join(tmp, "out/assets"), {recursive: true});
        fs.writeFileSync(path.join(tmp, "out/assets/old.svg"), "<svg/>");

        // Act
        const result = run();

        // Assert
        assert.deepEqual(result.written, ["assets/logo.svg", "DESIGN.md"]);
        assert.deepEqual(result.deleted, ["assets/old.svg"]);
        assert.equal(
            fs.readFileSync(path.join(tmp, "out/assets/logo.svg"), "utf8"),
            "<svg>{{tb:nope}}</svg>",
        );
        assert.equal(fs.existsSync(path.join(tmp, "out/.DS_Store")), false);
        assert.deepEqual(run().written, []);
    });

    it("rejects asset names that aren't lowercase kebab-case", () => {
        // Arrange
        fs.writeFileSync(path.join(tmp, "src/DESIGN.md"), "x");
        fs.mkdirSync(path.join(tmp, "src/assets"));
        fs.writeFileSync(path.join(tmp, "src/assets/icon-Unit Test.svg"), "<svg/>");

        // Act, Assert
        assert.throws(run, /assets\/icon-Unit Test\.svg: asset names must be lowercase kebab-case/);
    });

    it("rejects a relative link to a file with no template", () => {
        // Arrange
        fs.writeFileSync(path.join(tmp, "src/DESIGN.md"), "x\n[a](guides/missing.md)");

        // Act, Assert
        assert.throws(run, /src\/DESIGN\.md:2: relative link "guides\/missing\.md" doesn't match any file in src/);
    });

    for (const [file, line] of [
        ["DESIGN.md", "[a](https://khan.github.io/design-system-guidelines/design-md/guides/a.md)"],
        ["guides/a.md", "<https://khan.github.io/design-system-guidelines/design-md/DESIGN.md>"],
    ]) {
        it(`rejects a published-URL self-link in ${file}`, () => {
            // Arrange
            fs.writeFileSync(path.join(tmp, "src/DESIGN.md"), "x");
            fs.writeFileSync(path.join(tmp, "src", file), line);

            // Act, Assert
            assert.throws(run, /:1: link to other DESIGN\.md files with a relative path/);
        });
    }
});
