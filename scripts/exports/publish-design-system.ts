/**
 * The deterministic half of `.claude/skills/publish-design-system/`. The skill
 * makes the Artifact tool calls; this script decides what they send.
 *
 *   stage [--ref origin/main] [--worktree]
 *       Fetch, pin the ref's SHA and extract exports/claude-design-system/ AT
 *       THAT SHA (git archive, never the working tree) into
 *       .design-system-publish/<sha>/. Prints JSON: sha, dir, config, the
 *       paths to read from the live system.
 *       --worktree stages the uncommitted working tree instead, for a test
 *       publish before the change is merged; its stamp says so.
 *   plan --dir <stage dir> --live <dir the Artifact reads saved into>
 *       Compares the live system with project/sync-record.json (what the last
 *       publish sent, by hash). Prints JSON: drift (files or assets changed on
 *       the page since then: stop), send, remove, upload.
 *   finish --dir <stage dir> --live <dir> --uploads <uploads.json> --by <name> [--accept-drift]
 *       Writes project/design-system.json (the live index with only our keys
 *       changed, `lastChange` stamped with the SHA and WB versions) and
 *       project/sync-record.json into the stage dir, and prints the publish
 *       call's `root`, `file_path` and `files`. Refuses while there is drift,
 *       unless --accept-drift (only when the user said in words that the
 *       page's changes may be overwritten).
 *   smoke-check <page.html>
 *       Static checks on a page a fresh agent built from the system.
 */
import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

import {skeleton} from "./artifact.ts";
import type {PublishManifest} from "./claude.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EXPORT = "exports/claude-design-system";
const STAGE_ROOT = path.join(ROOT, ".design-system-publish");
const INDEX = "project/design-system.json";
const RECORD = "project/sync-record.json";
const REPO = "Khan/design-system-guidelines";

export type Config = {url: string | null; typeUrl: string; typeRelease: string | null; title: string};
export type Record_ = {
    sha: string;
    publishedAt: string;
    /** project path → sha256 of what was sent */
    files: Record<string, string>;
    /** project path → {sha256, blob} of each uploaded asset */
    assets: Record<string, {sha256: string; blob: string}>;
};
type Index = Record<string, unknown> & {
    assetGroups?: Record<string, {name: string; tile?: string; order?: Array<string>; files?: Record<string, unknown>}>;
    groups?: Array<string>;
    createdOnFiles?: unknown;
    convertedFrom?: unknown;
};

const sha256 = (bytes: Buffer | string) => createHash("sha256").update(bytes).digest("hex");
const git = (...args: Array<string>) => execFileSync("git", args, {cwd: ROOT, encoding: "utf8"}).trim();
const readJson = <T>(file: string): T | undefined => (fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as T) : undefined);

function listFiles(dir: string): Array<string> {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir, {recursive: true, encoding: "utf8"})
        .filter((rel) => fs.statSync(path.join(dir, rel)).isFile())
        .map((rel) => rel.split(path.sep).join("/"))
        .sort();
}

export function stage(ref: string, worktree: boolean): Record<string, unknown> {
    let sha: string;
    let label: string;
    let dir: string;
    if (worktree) {
        sha = git("rev-parse", "HEAD");
        label = `${sha.slice(0, 7)}+worktree`;
        dir = path.join(STAGE_ROOT, label);
        fs.rmSync(dir, {recursive: true, force: true});
        fs.cpSync(path.join(ROOT, EXPORT), dir, {recursive: true});
    } else {
        const [remote, ...branch] = ref.split("/");
        git("fetch", "--quiet", remote, branch.join("/"));
        sha = git("rev-parse", "--verify", `${ref}^{commit}`);
        label = sha.slice(0, 7);
        dir = path.join(STAGE_ROOT, sha);
        fs.rmSync(dir, {recursive: true, force: true});
        fs.mkdirSync(dir, {recursive: true});
        // git archive reads the commit, so the working tree can't leak into a publish.
        const tar = execFileSync("git", ["archive", "--format=tar", sha, EXPORT], {cwd: ROOT, maxBuffer: 256 * 1024 * 1024});
        execFileSync("tar", ["-x", "-C", dir, "--strip-components=2"], {input: tar});
    }
    const config = readJson<Config>(path.join(dir, "config.json"));
    const manifest = readJson<PublishManifest>(path.join(dir, "publish.json"));
    if (!config || !manifest || !fs.existsSync(path.join(dir, "project"))) {
        throw new Error(`${ref} at ${label} has no ${EXPORT}/{config.json,publish.json,project/}; merge the export first`);
    }
    // The live system's URL comes from the working tree's config when the
    // staged one predates it (the first publish records it after the merge).
    const local = readJson<Config>(path.join(ROOT, EXPORT, "config.json"));
    const url = config.url ?? local?.url ?? null;
    const files = listFiles(path.join(dir, "project")).map((p) => `project/${p}`);
    const assets = new Set(manifest.uploads.map((u) => u.path));
    return {
        sha,
        label,
        worktree,
        dir,
        url,
        typeUrl: config.typeUrl,
        typeRelease: config.typeRelease,
        title: manifest.title,
        versions: manifest.versions,
        // Read these from the live system (one `read` with `paths`) before `plan`.
        readPaths: [INDEX, RECORD, ...files.filter((f) => !assets.has(f))],
    };
}

export type Plan = {first: boolean; drift: Array<string>; send: Array<string>; remove: Array<string>; upload: Array<string>; notes: Array<string>};

/** What to send, given the staged files and what the live system holds now. */
export function plan(dir: string, live: string): Plan {
    const manifest = readJson<PublishManifest>(path.join(dir, "publish.json"))!;
    const index = readJson<Index>(path.join(live, INDEX));
    const record = readJson<Record_>(path.join(live, RECORD));
    const notes: Array<string> = [];
    const drift: Array<string> = [];
    if (index && !index.createdOnFiles && !index.convertedFrom) {
        throw new Error(`${INDEX} has no createdOnFiles/convertedFrom marker: the page treats it as read-only, so don't write over it`);
    }
    if (index && !record) {
        drift.push(`${RECORD} is missing but the system has an index: it wasn't made by this skill, or someone removed the record`);
    }
    if (record) {
        for (const [p, hash] of Object.entries(record.files)) {
            const file = path.join(live, p);
            if (!fs.existsSync(file)) drift.push(`${p}: deleted on the page`);
            else if (sha256(fs.readFileSync(file)) !== hash) drift.push(`${p}: edited on the page`);
        }
        const blobs = new Map<string, string>();
        for (const g of Object.values(index?.assetGroups ?? {})) {
            for (const [key, rec] of Object.entries(g.files ?? {})) blobs.set(`${g.name}/${key}`, (rec as {blob: string}).blob);
        }
        for (const [p, a] of Object.entries(record.assets)) {
            const key = p.replace(/^project\/assets\//, "");
            if (blobs.get(key) !== a.blob) drift.push(`${p}: asset replaced or removed on the page`);
        }
        const stamp = (index?.lastChange ?? {}) as {sha?: string; via?: string};
        if (stamp.sha !== record.sha) drift.push(`${INDEX}: lastChange (${stamp.via ?? "none"}) isn't this skill's last publish (${record.sha.slice(0, 7)})`);
    }
    const assetPaths = new Set(manifest.uploads.map((u) => u.path));
    const staged = listFiles(path.join(dir, "project")).map((p) => `project/${p}`).filter((p) => p !== INDEX && p !== RECORD);
    const send = staged.filter((p) => !assetPaths.has(p) && record?.files[p] !== sha256(fs.readFileSync(path.join(dir, p))));
    const upload = staged.filter((p) => assetPaths.has(p) && record?.assets[p]?.sha256 !== sha256(fs.readFileSync(path.join(dir, p))));
    const remove = Object.keys(record?.files ?? {}).filter((p) => !staged.includes(p));
    if (record && record.sha === readJson<{sha?: string}>(path.join(dir, "stage.json"))?.sha) notes.push("this SHA is already published");
    return {first: !index, drift, send, remove, upload, notes};
}

/** The live index with only this skill's keys changed. Never drops a key or another group's records. */
export function mergeIndex(
    liveIndex: Index | undefined,
    manifest: PublishManifest,
    assets: Record<string, {sha256: string; blob: string}>,
    sizes: Map<string, {name: string; group: string; size: number; type: string; key: string}>,
    stamp: Record<string, string>,
    now: string,
): Index {
    const index: Index = liveIndex
        ? structuredClone(liveIndex)
        : {
              v: 3,
              layout: "files",
              createdOnFiles: {v: 1, at: now},
              sections: {},
              blobs: {},
              docs: {readme: "project/README.md", sections: []},
          };
    index.title = manifest.title;
    index.libraries = manifest.libraries;
    index.editing = manifest.editing;
    const groups = {...(index.assetGroups ?? {})};
    for (const name of manifest.groups) {
        const g = manifest.assetGroups[name];
        const files: Record<string, unknown> = {};
        for (const [p, a] of Object.entries(assets)) {
            const u = sizes.get(p);
            if (u && u.group === name) files[u.key] = {name: u.name, blob: a.blob, size: u.size, type: u.type};
        }
        groups[name] = {...(groups[name] ?? {}), name, tile: g.tile, order: g.order, files};
    }
    index.assetGroups = groups;
    const others = (index.groups ?? []).filter((g) => !manifest.groups.includes(g));
    index.groups = [...manifest.groups, ...others];
    index.lastChange = stamp;
    return index;
}

function finish(dir: string, live: string, uploadsFile: string, by: string, acceptDrift: boolean): Record<string, unknown> {
    const manifest = readJson<PublishManifest>(path.join(dir, "publish.json"))!;
    const st = readJson<{sha: string; label: string; worktree: boolean}>(path.join(dir, "stage.json"))!;
    const p = plan(dir, live);
    if (p.drift.length > 0 && !acceptDrift) throw new Error(`drift on the page; resolve before publishing:\n  ${p.drift.join("\n  ")}`);
    // Overwriting accepted drift means resending the drifted files too.
    if (acceptDrift) for (const d of p.drift) {
        const f = d.split(":")[0];
        if (f.startsWith("project/") && f !== INDEX && fs.existsSync(path.join(dir, f)) && !p.send.includes(f) && !f.startsWith("project/assets/")) p.send.push(f);
        if (f.startsWith("project/assets/") && !p.upload.includes(f)) p.upload.push(f);
    }
    const record = readJson<Record_>(path.join(live, RECORD));
    const uploaded = readJson<Record<string, string>>(uploadsFile) ?? {};
    const assets: Record_["assets"] = {};
    const sizes = new Map(manifest.uploads.map((u) => [u.path, u]));
    for (const u of manifest.uploads) {
        const hash = sha256(fs.readFileSync(path.join(dir, u.path)));
        const reuse = record?.assets[u.path]?.sha256 === hash && !p.upload.includes(u.path);
        const blob = uploaded[u.path]?.replace(/^\/_blob\//, "") ?? (reuse ? record!.assets[u.path].blob : undefined);
        if (!blob) throw new Error(`${u.path} changed or is new but has no upload id in ${uploadsFile}`);
        assets[u.path] = {sha256: hash, blob};
    }
    const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    const cdn = manifest.versions.cdn;
    const stamp: Record<string, string> = {
        by,
        at: now,
        via: `GitHub · ${REPO}@${st.label}`,
        note: `${st.worktree ? "TEST publish of an uncommitted working tree. " : ""}${p.send.length} files and ${p.upload.length} assets updated from ${st.label}; tokens ${manifest.versions.tokens}, components on jsDelivr (core ${cdn.core}, button ${cdn.button}).`.slice(0, 280),
        sha: st.sha,
        tokensPackage: manifest.versions.tokens,
        cdnTokens: cdn.tokens,
        cdnCore: cdn.core,
        cdnButton: cdn.button,
    };
    const liveIndex = readJson<Index>(path.join(live, INDEX));
    const index = mergeIndex(liveIndex, manifest, assets, sizes, stamp, now);
    const files: Record_["files"] = {};
    for (const f of listFiles(path.join(dir, "project")).map((x) => `project/${x}`)) {
        if (f !== INDEX && f !== RECORD && !sizes.has(f)) files[f] = sha256(fs.readFileSync(path.join(dir, f)));
    }
    const newRecord: Record_ = {sha: st.sha, publishedAt: now, files, assets};
    fs.writeFileSync(path.join(dir, INDEX), `${JSON.stringify(index, null, 2)}\n`);
    fs.writeFileSync(path.join(dir, RECORD), `${JSON.stringify(newRecord, null, 2)}\n`);
    // The index goes last in the same single call; the record rides along.
    const filesArg: Record<string, string | null> = {};
    for (const f of [...p.send, RECORD]) filesArg[f] = f;
    for (const f of p.remove) filesArg[f] = null;
    return {root: dir, file_path: path.join(dir, INDEX), files: filesArg, summary: {send: p.send.length, remove: p.remove.length, upload: p.upload.length, first: p.first}};
}

/** Static checks on a smoke-test page: built from the guide's boot, real WB components, no rebuilt controls. */
export function smokeCheck(page: string, guide: string): Array<string> {
    const problems: Array<string> = [];
    const skel = skeleton(guide);
    const boot = skel.slice(skel.indexOf("// ---------- WB boot"), skel.indexOf("// ---------- end WB boot"));
    if (!page.includes(boot)) problems.push("the WB boot isn't copied verbatim from the Claude artifact guide");
    const app = page.slice(page.indexOf("// ---------- end WB boot"));
    if (!/await (wb\(|Promise\.all\(\[\s*wb\()/.test(app)) problems.push("loads no Wonder Blocks package with wb()");
    for (const tag of ["button", "input", "textarea", "select", "a "]) {
        if (new RegExp(`<${tag}[\\s>]`, "i").test(app.replace(/<\$\{[^}]+\}/g, ""))) problems.push(`raw <${tag.trim()}> in the app; use the WB component`);
    }
    const hex = app.match(/#[0-9a-fA-F]{6}\b/g) ?? [];
    if (hex.length > 0) problems.push(`raw hex colors in the app (${[...new Set(hex)].slice(0, 5).join(", ")}); use var(--wb-…)`);
    if (/ThemeSwitcher|data-wb-theme=/.test(app)) problems.push("themes with ThemeSwitcher or a wrapper instead of setTheme() on <html>");
    if (/<!doctype|<html|<body>/i.test(page)) problems.push("isn't an HTML fragment");
    return problems;
}

function arg(name: string, args: Array<string>): string | undefined {
    const i = args.indexOf(name);
    return i === -1 ? undefined : args[i + 1];
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
    const [cmd, ...args] = process.argv.slice(2);
    const need = (name: string) => {
        const v = arg(name, args);
        if (!v) throw new Error(`${cmd} needs ${name}`);
        return v;
    };
    let out: unknown;
    if (cmd === "stage") {
        out = stage(arg("--ref", args) ?? "origin/main", args.includes("--worktree"));
        const o = out as {dir: string};
        fs.writeFileSync(path.join(o.dir, "stage.json"), `${JSON.stringify(out, null, 2)}\n`);
    } else if (cmd === "plan") {
        out = plan(need("--dir"), need("--live"));
    } else if (cmd === "finish") {
        out = finish(need("--dir"), need("--live"), need("--uploads"), need("--by"), args.includes("--accept-drift"));
    } else if (cmd === "smoke-check") {
        const problems = smokeCheck(fs.readFileSync(args[0], "utf8"), fs.readFileSync(path.join(ROOT, "exports/design-md/guides/claude-artifact.md"), "utf8"));
        out = {ok: problems.length === 0, problems};
        if (problems.length) process.exitCode = 1;
    } else {
        console.error("usage: node scripts/exports/publish-design-system.ts stage [--ref origin/main] [--worktree] | plan --dir D --live L | finish --dir D --live L --uploads U --by NAME [--accept-drift] | smoke-check page.html");
        process.exit(2);
    }
    console.log(JSON.stringify(out, null, 2));
}
