import * as assert from "node:assert/strict";
import {createHash} from "node:crypto";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import {afterEach, beforeEach, describe, it} from "node:test";
import {fileURLToPath} from "node:url";

import {cardValueHex, mergeIndex, plan, smokeCheck} from "./publish-design-system.ts";
import type {PublishManifest} from "./claude.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const manifest: PublishManifest = {
    generatedFrom: "test",
    title: "Wonder Blocks",
    editing: "code",
    libraries: [],
    groups: ["Brand"],
    assetGroups: {Brand: {name: "Brand", tile: "l", order: ["mark.svg"]}},
    uploads: [{group: "Brand", name: "mark.svg", key: "mark.svg", path: "project/assets/Brand/mark.svg", type: "image/svg+xml", size: 5}],
    versions: {tokens: "18.0.0", cdn: {core: "12.5.0", button: "11.7.15", tokens: "18.2.1"}},
};

describe("plan", () => {
    let tmp: string;
    let dir: string;
    let live: string;
    const write = (base: string, rel: string, text: string) => {
        fs.mkdirSync(path.dirname(path.join(base, rel)), {recursive: true});
        fs.writeFileSync(path.join(base, rel), text);
    };
    const record = {sha: "a".repeat(40), publishedAt: "x", files: {"project/README.md": sha("old"), "project/gone.md": sha("gone")}, assets: {"project/assets/Brand/mark.svg": {sha256: sha("<svg>"), blob: "b1"}}};
    const index = {v: 3, createdOnFiles: {v: 1}, lastChange: {sha: "a".repeat(40)}, assetGroups: {Brand: {name: "Brand", files: {"mark.svg": {blob: "b1"}}}}};

    beforeEach(() => {
        tmp = fs.mkdtempSync(path.join(os.tmpdir(), "publish-"));
        dir = path.join(tmp, "stage");
        live = path.join(tmp, "live");
        write(dir, "publish.json", JSON.stringify(manifest));
        write(dir, "project/README.md", "new");
        write(dir, "project/tokens.json", "{}");
        write(dir, "project/assets/Brand/mark.svg", "<svg>");
        write(live, "project/design-system.json", JSON.stringify(index));
        write(live, "project/sync-record.json", JSON.stringify(record));
        write(live, "project/README.md", "old");
        write(live, "project/gone.md", "gone");
    });
    afterEach(() => fs.rmSync(tmp, {recursive: true, force: true}));

    it("sends only changed files, removes what's no longer generated, skips unchanged assets", () => {
        // Act
        const p = plan(dir, live);

        // Assert
        assert.deepEqual(p.drift, []);
        assert.deepEqual(p.send, ["project/README.md", "project/tokens.json"]);
        assert.deepEqual(p.remove, ["project/gone.md"]);
        assert.deepEqual(p.upload, []);
    });

    it("reports a file edited on the page as drift", () => {
        // Arrange
        write(live, "project/README.md", "edited by a person");

        // Act, Assert
        assert.deepEqual(plan(dir, live).drift, ["project/README.md: edited on the page"]);
    });

    it("reports an asset replaced on the page, and a foreign lastChange, as drift", () => {
        // Arrange
        write(live, "project/design-system.json", JSON.stringify({...index, lastChange: {via: "page"}, assetGroups: {Brand: {name: "Brand", files: {"mark.svg": {blob: "b2"}}}}}));

        // Act
        const {drift} = plan(dir, live);

        // Assert
        assert.equal(drift.length, 2);
        assert.match(drift[0], /mark\.svg: asset replaced/);
        assert.match(drift[1], /lastChange \(page\) isn't this skill's last publish/);
    });

    it("refuses an index with no marker", () => {
        // Arrange
        write(live, "project/design-system.json", JSON.stringify({v: 3}));

        // Act, Assert
        assert.throws(() => plan(dir, live), /no createdOnFiles\/convertedFrom marker/);
    });

    it("treats a system with no index as a first publish that sends everything", () => {
        // Arrange
        fs.rmSync(live, {recursive: true});

        // Act
        const p = plan(dir, live);

        // Assert
        assert.equal(p.first, true);
        assert.deepEqual(p.upload, ["project/assets/Brand/mark.svg"]);
        assert.deepEqual(p.send, ["project/README.md", "project/tokens.json"]);
    });
});

describe("mergeIndex", () => {
    const sizes = new Map(manifest.uploads.map((u) => [u.path, u]));
    const assets = {"project/assets/Brand/mark.svg": {sha256: "h", blob: "b9"}};
    const stamp = {by: "Claude", at: "2026-11-23T00:00:00Z", via: "GitHub · x@abc1234", sha: "abc"};

    it("creates a new index with the createdOnFiles marker", () => {
        // Act
        const index = mergeIndex(undefined, manifest, assets, sizes, stamp, "2026-11-23T00:00:00Z");

        // Assert
        assert.deepEqual(index.createdOnFiles, {v: 1, at: "2026-11-23T00:00:00Z"});
        assert.equal(index.layout, "files");
        assert.equal(index.editing, "code");
        assert.deepEqual(index.libraries, []);
        assert.deepEqual(index.assetGroups!.Brand.files, {"mark.svg": {name: "mark.svg", blob: "b9", size: 5, type: "image/svg+xml"}});
        assert.deepEqual(index.lastChange, stamp);
    });

    it("keeps every key and group it doesn't own", () => {
        // Arrange
        const live = {v: 3, layout: "files", createdOnFiles: {v: 1, at: "then"}, title: "Old", sections: {a: "b"}, docs: {x: 1}, groups: ["Mine", "Brand"], assetGroups: {Mine: {name: "Mine", files: {"x.png": {blob: "z"}}}}};

        // Act
        const index = mergeIndex(live, manifest, assets, sizes, stamp, "now");

        // Assert
        assert.deepEqual(index.createdOnFiles, {v: 1, at: "then"});
        assert.deepEqual(index.sections, {a: "b"});
        assert.deepEqual(index.groups, ["Brand", "Mine"]);
        assert.ok(index.assetGroups!.Mine);
        assert.equal(index.title, "Wonder Blocks");
    });
});

describe("smokeCheck", () => {
    const guide = fs.readFileSync(path.join(ROOT, "exports/design-md/guides/claude-artifact.md"), "utf8");
    const skel = guide.match(/```html\n([\s\S]*?)```/)![1];

    it("passes the guide's own skeleton", () => {
        // Act, Assert
        assert.deepEqual(smokeCheck(skel, guide), []);
    });

    it("flags rebuilt controls, raw hex and ThemeSwitcher", () => {
        // Arrange
        const page = skel.replace("function App() {", "const x = '<button style=\"color:#123456\">'; const T = ThemeSwitcher;\n  function App() {");

        // Act
        const problems = smokeCheck(page, guide);

        // Assert
        assert.equal(problems.length, 3);
    });

    it("allows the chart colors the cards publish as Values", () => {
        // Arrange
        const allowed = cardValueHex(path.join(ROOT, "exports/claude-design-system/project/components"));
        const page = skel.replace("function App() {", "const fill = '#8DA2FF';\n  function App() {");

        // Act
        const problems = smokeCheck(page, guide, allowed);

        // Assert
        assert.ok(allowed.has("#8da2ff"));
        assert.deepEqual(problems, []);
    });

    it("still flags a hex color no card publishes", () => {
        // Arrange
        const allowed = cardValueHex(path.join(ROOT, "exports/claude-design-system/project/components"));
        const page = skel.replace("function App() {", "const fill = '#123456';\n  function App() {");

        // Act
        const problems = smokeCheck(page, guide, allowed);

        // Assert
        assert.equal(problems.length, 1);
    });
});
