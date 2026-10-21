import * as assert from "node:assert/strict";
import {describe, it} from "node:test";

import {loadTokens, parseThemes, varName} from "./tokens.ts";

const css = (tb: string, dark = "", base = "") =>
    `:root, [data-wb-theme='default'] {${base}}` +
    `[data-wb-theme='syl-dark'] {${dark}}` +
    `[data-wb-theme='thunderblocks'] {${tb}}`;

describe("parseThemes", () => {
    it("merges every block that shares a theme selector", () => {
        // Arrange
        const input =
            css("--wb-a: #fff;") +
            "[data-wb-theme='thunderblocks'] {--wb-b: 1px;}";

        // Act
        const themes = parseThemes(input);

        // Assert
        assert.equal(themes.thunderblocks.get("--wb-a"), "#FFF");
        assert.equal(themes.thunderblocks.get("--wb-b"), "1px");
    });

    it("layers default → thunderblocks → syl-dark", () => {
        // Arrange
        const input = css("--wb-a: #111111;", "--wb-a: #222222;", "--wb-a: #000000; --wb-only-default: 1px;");

        // Act
        const themes = parseThemes(input);

        // Assert
        assert.equal(themes.thunderblocks.get("--wb-a"), "#111111");
        assert.equal(themes["syl-dark"].get("--wb-a"), "#222222");
        assert.equal(themes["syl-dark"].get("--wb-only-default"), "1px");
    });

    it("resolves var() chains and converts rem to px", () => {
        // Arrange
        const input = css(
            "--wb-sizing-size_320: 3.2rem;" +
                "--wb-font-heading-size-xxlarge: var(--wb-sizing-size_320);",
        );

        // Act
        const themes = parseThemes(input);

        // Assert
        assert.equal(themes.thunderblocks.get("--wb-font-heading-size-xxlarge"), "32px");
    });

    it("resolves var() inside calc() and leaves the calc unevaluated", () => {
        // Arrange
        const input = css(
            "--wb-sizing-size_060: 0.6rem;" +
                "--wb-x: calc(var(--wb-sizing-size_060) / 2 * -1);",
        );

        // Act
        const themes = parseThemes(input);

        // Assert
        assert.equal(themes.thunderblocks.get("--wb-x"), "calc(6px / 2 * -1)");
    });

    it("uppercases hex values inside functions", () => {
        // Arrange
        const input = css("--wb-s: 0 2px 2px 0 color-mix(in srgb, #25236a 20%, transparent);");

        // Act
        const themes = parseThemes(input);

        // Assert
        assert.equal(
            themes.thunderblocks.get("--wb-s"),
            "0 2px 2px 0 color-mix(in srgb, #25236A 20%, transparent)",
        );
    });

    it("throws on a var() cycle", () => {
        // Arrange
        const input = css("--wb-a: var(--wb-b); --wb-b: var(--wb-a);");

        // Act, Assert
        assert.throws(() => parseThemes(input), /Cycle/);
    });

    it("throws on a reference to a missing variable", () => {
        // Arrange
        const input = css("--wb-a: var(--wb-missing);");

        // Act, Assert
        assert.throws(() => parseThemes(input), /Unknown CSS variable/);
    });

    it("throws when a var() fallback leaves an unresolved reference", () => {
        // Arrange
        const input = css("--wb-b: 1px; --wb-a: var(--wb-b, var(--wb-b));");

        // Act, Assert
        assert.throws(() => parseThemes(input), /Unresolved var\(\)/);
    });

    it("throws when rem converts to a fractional pixel value", () => {
        // Arrange
        const input = css("--wb-a: 0.25rem;");

        // Act, Assert
        assert.throws(() => parseThemes(input), /fractional/);
    });

    it("throws on @-rules so a CSS format change fails loudly", () => {
        // Arrange
        const input = `@media (min-width: 1px) {${css("--wb-a: 1px;")}}`;

        // Act, Assert
        assert.throws(() => parseThemes(input), /@-rules/);
    });

    it("throws when a theme block is missing", () => {
        // Arrange
        const input = "[data-wb-theme='thunderblocks'] {--wb-a: 1px;}";

        // Act, Assert
        assert.throws(() => parseThemes(input), /missing/);
    });
});

describe("varName", () => {
    it("joins a dotted path with dashes", () => {
        // Arrange, Act
        const name = varName("c.form-field.sizing.height");

        // Assert
        assert.equal(name, "--wb-c-form-field-sizing-height");
    });
});

describe("loadTokens", () => {
    it("reads the installed tokens package", () => {
        // Arrange, Act
        const {css: realCss, tokensVersion} = loadTokens();
        const themes = parseThemes(realCss);

        // Assert
        assert.match(tokensVersion, /^\d+\.\d+\.\d+/);
        assert.ok(themes.thunderblocks.size > 100);
        assert.equal(themes.thunderblocks.size, themes["syl-dark"].size);
    });
});
