import * as assert from "node:assert/strict";
import {describe, it} from "node:test";

import {buildTokensJson, compileTokensCss, toTypeColor, toTypeShadow, usageFor} from "./tokens-json.ts";
import {parseThemes} from "./tokens.ts";

const css = (tb: string, dark = "") =>
    ":root, [data-wb-theme='default'] {}" +
    `[data-wb-theme='syl-dark'] {${dark}}` +
    `[data-wb-theme='thunderblocks'] {${tb}}`;

const FULL =
    "--wb-semanticColor-core-background-base-default: #FFFFFF;" +
    "--wb-semanticColor-learning-math-foreground-blue: #1865F2;" +
    "--wb-semanticColor-core-transparent: transparent;" +
    "--wb-sizing-size_160: 1.6rem;" +
    "--wb-border-radius-radius_080: 0.8rem;" +
    "--wb-border-width-thin: 0.1rem;" +
    "--wb-boxShadow-low: 0 2px 2px 0 color-mix(in srgb, #252368 20%, transparent);" +
    "--wb-font-family-sans: Plus Jakarta Sans, sans-serif;" +
    "--wb-font-family-mono: Inconsolata, monospace;" +
    "--wb-font-family-serif: serif;" +
    "--wb-font-weight-bold: 700; --wb-font-weight-medium: 500;" +
    "--wb-font-heading-size-small: 1.6rem; --wb-font-heading-lineHeight-small: 2rem;" +
    "--wb-font-heading-size-large: 2rem; --wb-font-heading-lineHeight-large: 2.8rem;" +
    "--wb-font-body-size-medium: 1.6rem; --wb-font-body-lineHeight-medium: 2.4rem;";

const NOTES = {
    "semanticColor.core": "Core.",
    "semanticColor.learning": "Learning.",
    sizing: "Spacing.",
    "border.radius": "Radius.",
    "border.width": "Width.",
    boxShadow: "Elevation.",
    "font.heading.size": "Headings.",
    "font.body.size": "Body.",
};

const build = (notes: Record<string, string> = NOTES) =>
    buildTokensJson(parseThemes(css(FULL, "--wb-semanticColor-core-background-base-default: #252531;")), {
        title: "Test",
        tokensVersion: "18.0.0",
        notes,
    });

describe("toTypeColor", () => {
    it("keeps hex (lowercased) and rgba()", () => {
        // Act, Assert
        assert.equal(toTypeColor("#5753FA", "x"), "#5753fa");
        assert.equal(toTypeColor("rgba(21,21,33,0.60)", "x"), "rgba(21,21,33,0.60)");
    });

    it("rewrites transparent and WB's faded color-mix exactly", () => {
        // Act, Assert
        assert.equal(toTypeColor("transparent", "x"), "#00000000");
        assert.equal(toTypeColor("color-mix(in srgb, #252368 20%, transparent)", "x"), "rgba(37,35,104,0.2)");
    });

    it("refuses anything else instead of guessing", () => {
        // Act, Assert
        assert.throws(() => toTypeColor("var(--wb-x)", "a.b"), /a\.b: "var\(--wb-x\)" isn't a color/);
        assert.throws(() => toTypeColor("currentColor", "a.b"), /isn't a color/);
        assert.throws(() => toTypeShadow("0 0 0 var(--x)", "a.b"), /can't be expressed/);
    });
});

describe("usageFor", () => {
    it("uses the longest matching prefix and names the CSS variable", () => {
        // Act
        const note = usageFor("semanticColor.core.background.base.default", {
            "semanticColor.core": "Core.",
            "semanticColor.core.background": "Surfaces.",
        });

        // Assert
        assert.equal(note, "Surfaces. CSS: `var(--wb-semanticColor-core-background-base-default)`.");
    });

    it("returns undefined without a prefix", () => {
        // Act, Assert
        assert.equal(usageFor("sizing.size_160", {"border": "x"}), undefined);
    });
});

describe("buildTokensJson", () => {
    it("lists thunderblocks first, then syl-dark, in the type's list grammar", () => {
        // Act
        const tokens = build();

        // Assert
        assert.deepEqual(tokens.color.themes.map((t) => t.id), ["light", "dark"]);
        const base = tokens.color.tokens.find((t) => t.name === "core-background-base-default");
        assert.deepEqual(base?.value, {light: "#ffffff", dark: "#252531"});
        assert.ok(tokens.color.tokens.every((t) => t.usage.length > 0));
    });

    it("orders color families core first, learning later", () => {
        // Act
        const names = build().color.tokens.map((t) => t.name);

        // Assert
        assert.deepEqual(names, ["core-background-base-default", "core-transparent", "learning-math-foreground-blue"]);
    });

    it("fills spacing, radius, border width, shadow and type styles", () => {
        // Act
        const tokens = build();

        // Assert
        assert.deepEqual(tokens.spacing.tokens.map((t) => [t.name, t.value]), [["size_160", "16px"]]);
        assert.deepEqual(tokens.radius.tokens.map((t) => [t.name, t.value]), [["radius_080", "8px"]]);
        assert.deepEqual(tokens.borderWidth.tokens.map((t) => t.name), ["border-width-thin"]);
        assert.deepEqual(tokens.shadow.tokens[0].value, {light: "0 2px 2px 0 rgba(37,35,104,0.2)", dark: "0 2px 2px 0 rgba(37,35,104,0.2)"});
        assert.deepEqual(tokens.type.groups[0].styles.map((s) => [s.name, s.fontSize, s.lineHeight, s.fontWeight]), [
            ["heading-large", "20px", "28px", 700],
            ["heading-small", "16px", "20px", 700],
        ]);
        assert.equal(tokens.type.families.sans, "Plus Jakarta Sans, sans-serif");
    });

    it("fails, naming the token, when a usage note is missing", () => {
        // Arrange
        const {sizing: _, ...notes} = NOTES;

        // Act, Assert
        assert.throws(() => build(notes), /sizing\.size_160: no usage note/);
    });
});

describe("compileTokensCss", () => {
    it("lays out tokens.css as the page would, with only changed values in later themes", () => {
        // Act
        const out = compileTokensCss(build());

        // Assert
        assert.ok(out.startsWith("/* Test — generated from tokens.json */\n"));
        assert.match(out, /:root, \[data-theme="light"\] \{\n {2}--core-background-base-default: #ffffff;/);
        assert.match(out, /\[data-theme="dark"\] \{\n {2}--core-background-base-default: #252531;\n\}/);
        assert.match(out, /--size_160: 16px;/);
        assert.match(out, /--font-sans: Plus Jakarta Sans, sans-serif;/);
        assert.match(out, /\.heading-large \{ font-family: var\(--font-sans\); font-size: 20px;/);
    });
});
