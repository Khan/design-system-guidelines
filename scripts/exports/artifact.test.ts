/**
 * Guards for the Claude artifact guide (exports/src/guides/claude-artifact.md).
 *
 * Each pattern below was needed to make the real Wonder Blocks components
 * render correctly inside a Claude artifact; losing any of them breaks pages
 * silently or at load. These tests are offline. `pnpm artifact:check` is the
 * network check that the import map still matches the pinned versions.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {describe, it} from "node:test";
import {fileURLToPath} from "node:url";
import {formatImportMap, formatVersions, kitchenSink, readImportMap, readVersions, skeleton, wrapForPreview, ARTIFACT_CSP} from "./artifact.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const src = fs.readFileSync(path.join(ROOT, "exports/src/guides/claude-artifact.md"), "utf8");
const out = fs.readFileSync(path.join(ROOT, "exports/design-md/guides/claude-artifact.md"), "utf8");
const page = skeleton(out);

describe("claude-artifact guide: V and import map", () => {
    it("round-trips V and the import map exactly, so `artifact:update` rewrites them without noise", () => {
        const v = readVersions(src);
        assert.ok(src.includes(formatVersions(v)));
        assert.ok(src.includes(formatImportMap(readImportMap(src))));
    });

    it("pins tokens and every package the guide tells agents to import", () => {
        const v = readVersions(src);
        const imported = [...src.matchAll(/await wb\("([\w-]+)"\)/g)].map((m) => m[1]);
        for (const pkg of new Set(["tokens", ...imported])) assert.ok(v[pkg], `V has no version for "${pkg}"`);
    });

    it("maps every non-18.2.0 React the ESM builds pull in, and only to 18.2.0", () => {
        const map = readImportMap(src);
        const reacts = Object.entries(map).filter(([k]) => /\/npm\/react(-dom)?@/.test(k));
        assert.ok(reacts.length > 0);
        for (const [k, to] of reacts) {
            assert.match(k, /\/$/, `${k} must be a prefix mapping (trailing slash) so subpaths like jsx-runtime follow`);
            assert.match(to, /\/npm\/react(-dom)?@18\.2\.0\/$/);
        }
    });

    it("maps WB's built-in Phosphor icons (which 404 on jsDelivr) to @iconify-icons/ph", () => {
        const icons = Object.entries(readImportMap(src)).filter(([k]) => k.includes("@phosphor-icons/core"));
        assert.ok(icons.length > 0);
        for (const [k, to] of icons) {
            const name = k.match(/\/([\w-]+)\.svg\/\+esm$/)?.[1];
            assert.equal(to, `https://cdn.jsdelivr.net/npm/@iconify-icons/ph@2.0.0/${name}/+esm`);
        }
    });
});

describe("claude-artifact guide: page skeleton", () => {
    const has = (needle: string | RegExp, why: string) => it(why, () => (typeof needle === "string" ? assert.ok(page.includes(needle)) : assert.match(page, needle)));

    has(/html \{ font-size: 62\.5%; \}/, "sets the 10px root that WB's rem tokens assume (without it everything renders 1.6x)");
    has(/<script type="importmap">[\s\S]*<script type="module">/, "puts the import map before the module script");
    has("/dist/css/index.css/+esm", "loads the token CSS as a jsDelivr module (no <link>, no 155 KB inline)");
    has('setAttribute("data-wb-theme"', "themes <html>, so portaled modals, menus and popovers get the theme");
    has("prefers-color-scheme: dark", "starts in the viewer's light/dark preference");
    has("@iconify-icons/ph@", "patches WB's built-in icons from the import map");
    has('Symbol.for("react.element")', "makes built-in icons valid elements, because Button/IconButton cloneElement non-string icons");
    has("Object.setPrototypeOf(d, String.prototype)", "makes built-in icons behave as strings for PhosphorIcon's mask-image url() and startsWith");
    has("PhosphorIcon: BootPhosphorIcon", "keeps the boot's PhosphorIcon binding out of the way of the user's own import");
    has("new Proxy(m,", "turns a wrong import name into a readable error instead of a blank page");
    has("react@18.2.0/+esm", "loads React 18.2.0");
    has("htm@3.1.1/+esm", "uses htm (CSP-safe) instead of Babel");
    has(/react\(-dom\)\?@\(\?!18\\\.2\\\.0\\\/\)/, "fails loudly if a second React copy loads");
    has('addEventListener("error"', "shows runtime crashes on the page instead of going blank");
    has("<meta name=\"claude:viewport-fit-sides\"", "has the artifact viewport meta tag");

    it("is an HTML fragment (the artifact host adds the document skeleton)", () => {
        assert.doesNotMatch(page, /<!doctype|<html|<head>|<body>/i);
    });

    it("only loads scripts and styles from hosts the artifact CSP allows", () => {
        for (const m of page.matchAll(/https:\/\/[^\s"'`)]+/g)) {
            const url = m[0];
            if (url.startsWith("https://fonts.googleapis.com/")) continue;
            if (url.startsWith("http://www.w3.org/")) continue;
            assert.ok(url.startsWith("https://cdn.jsdelivr.net/npm/"), `${url} isn't allowed by the artifact CSP`);
        }
    });

    it("splices the kitchen-sink app in after the boot without touching the boot", () => {
        const ks = kitchenSink(page, "/* app */");
        const bootEnd = page.indexOf("// ---------- end WB boot ----------");
        assert.equal(ks.slice(0, bootEnd), page.slice(0, bootEnd));
        assert.ok(ks.includes("/* app */\n} catch (e) {"));
    });

    it("previews under the same CSP the artifact host uses", () => {
        assert.ok(wrapForPreview(page).includes(`content="${ARTIFACT_CSP}"`));
        assert.match(ARTIFACT_CSP, /img-src data: blob:; connect-src 'none'/);
    });
});
