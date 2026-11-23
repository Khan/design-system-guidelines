/**
 * Maintenance for the Claude artifact setup in exports/src/guides/claude-artifact.md.
 *
 * That guide pins Wonder Blocks versions (`const V = {…}`) and an import map
 * that patches jsDelivr's ESM builds so the real components run inside a
 * Claude artifact. Both are tied to exact package versions, so re-run this
 * after any Wonder Blocks bump.
 *
 *   node scripts/exports/artifact.ts check     recompute the import map for the guide's V; fail if it differs
 *   node scripts/exports/artifact.ts update    bump V to the latest npm versions and rewrite V + import map in the guide
 *   node scripts/exports/artifact.ts preview [kitchen-sink | path/to/page.html]
 *                                              serve a page under the artifact CSP at http://localhost:8765
 *
 * Why the import map exists (see the guide for the full story):
 * - jsDelivr rewrites WB's `@phosphor-icons/core/<weight>/<name>.svg` imports
 *   to `…/<name>.svg/+esm`, which 404s and breaks the whole package. Each one is
 *   mapped to `@iconify-icons/ph@2.0.0/<name>/+esm`; the guide's boot turns
 *   those into data-URI icons.
 * - Several dependencies' ESM builds pull in their own React (18.1.0, 19.x).
 *   Each version is prefix-mapped to react@18.2.0 / react-dom@18.2.0.
 * - aphrodite@1.x has no named ESM exports on jsDelivr; it's mapped to 2.4.0.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const GUIDE_SRC = path.join(ROOT, "exports/src/guides/claude-artifact.md");
const GUIDE_OUT = path.join(ROOT, "exports/design-md/guides/claude-artifact.md");
const KITCHEN_SINK = path.join(ROOT, "scripts/exports/artifact-kitchen-sink.js");
const NPM = "https://cdn.jsdelivr.net/npm/";
const REACT = "18.2.0";
const ICONIFY = "@iconify-icons/ph@2.0.0";
const APHRODITE = "aphrodite@2.4.0";

// The artifact sandbox's content security policy, as observed on claude.ai.
export const ARTIFACT_CSP =
    "default-src 'none'; script-src 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net/npm/ https://unpkg.com https://cdn.tailwindcss.com https://code.jquery.com; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src data: blob:; connect-src 'none'";

type Versions = Record<string, string>;
type ImportMap = Record<string, string>;

const V_LINE = /^const V = (\{.*\});$/m;
const MAP_BLOCK = /(<script type="importmap">\n)(\{"imports": \{\n[\s\S]*?\n\}\})(\n<\/script>)/;

export function readVersions(guide: string): Versions {
    const m = guide.match(V_LINE);
    if (!m) throw new Error(`${GUIDE_SRC}: no "const V = {…};" line`);
    // Keys are either bare identifiers or double-quoted; values are always double-quoted.
    const json = m[1].replace(/([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/g, '$1"$2"$3');
    return JSON.parse(json) as Versions;
}

export function readImportMap(guide: string): ImportMap {
    const m = guide.match(MAP_BLOCK);
    if (!m) throw new Error(`${GUIDE_SRC}: no import map block`);
    return (JSON.parse(m[2]) as {imports: ImportMap}).imports;
}

export function formatVersions(v: Versions): string {
    const entries = Object.entries(v).map(([k, val]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${JSON.stringify(val)}`);
    return `const V = { ${entries.join(", ")} };`;
}

export function formatImportMap(map: ImportMap): string {
    const group = (k: string) => (k.includes("/aphrodite@") ? 0 : k.includes("/react@") ? 1 : k.includes("/react-dom@") ? 2 : 3);
    const keys = Object.keys(map).sort((a, b) => group(a) - group(b) || (a < b ? -1 : a > b ? 1 : 0));
    return `{"imports": {\n${keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(map[k])}`).join(",\n")}\n}}`;
}

/** Walk the jsDelivr ESM import graph of every package in V and derive the import map it needs. */
export async function computeImportMap(v: Versions): Promise<{map: ImportMap; unhandled: string[]; notes: string[]}> {
    const status = new Map<string, number>();
    const visit = async (url: string): Promise<void> => {
        if (status.has(url)) return;
        status.set(url, 0);
        const res = await fetch(url);
        status.set(url, res.status);
        if (!res.ok) return;
        const text = await res.text();
        const deps = new Set([...text.matchAll(/(?:from|import)\s*\(?\s*["'](\/npm\/[^"']+)["']/g)].map((m) => "https://cdn.jsdelivr.net" + m[1]));
        await Promise.all([...deps].map(visit));
    };
    const roots = Object.entries(v).map(([pkg, ver]) => `${NPM}@khanacademy/wonder-blocks-${pkg}@${ver}/+esm`);
    roots.push(`${NPM}react@${REACT}/+esm`, `${NPM}react-dom@${REACT}/client/+esm`);
    await Promise.all(roots.map(visit));

    const map: ImportMap = {};
    const unhandled: string[] = [];
    for (const [url, code] of status) {
        let m: RegExpMatchArray | null;
        if ((m = url.match(/\/npm\/(react|react-dom)@([^/]+)\//)) && m[2] !== REACT) map[`${NPM}${m[1]}@${m[2]}/`] = `${NPM}${m[1]}@${REACT}/`;
        else if (/\/npm\/aphrodite@1\./.test(url)) map[url] = `${NPM}${APHRODITE}/+esm`;
        else if ((m = url.match(/\/npm\/@phosphor-icons\/core@[^/]+\/\w+\/([\w-]+)\.svg\/\+esm$/))) map[url] = `${NPM}${ICONIFY}/${m[1]}/+esm`;
        else if (code !== 200) unhandled.push(`${code} ${url}`);
    }
    // Every icon target must exist, or the boot will fail on it.
    for (const target of new Set(Object.values(map).filter((t) => t.includes(ICONIFY)))) {
        const res = await fetch(target, {method: "HEAD"});
        if (!res.ok) unhandled.push(`${res.status} ${target} (icon target; pick another @iconify-icons/ph name)`);
    }
    const versions = new Map<string, Set<string>>();
    for (const url of status.keys()) {
        const m = url.match(/\/npm\/((?:@[^/]+\/)?[^@/]+)@([^/]+)/);
        if (m) versions.set(m[1], (versions.get(m[1]) ?? new Set()).add(m[2]));
    }
    const notes = [...versions].filter(([p, s]) => s.size > 1 && !/^react(-dom)?$/.test(p)).map(([p, s]) => `${p} loads ${[...s].join(", ")}`);
    return {map, unhandled, notes};
}

function diffMaps(a: ImportMap, b: ImportMap): string[] {
    const out: string[] = [];
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
        if (!(k in b)) out.push(`- ${k}`);
        else if (!(k in a)) out.push(`+ ${k} -> ${b[k]}`);
        else if (a[k] !== b[k]) out.push(`~ ${k}: ${a[k]} -> ${b[k]}`);
    }
    return out;
}

async function latest(pkg: string): Promise<string> {
    const res = await fetch(`https://registry.npmjs.org/@khanacademy/wonder-blocks-${pkg}/latest`);
    if (!res.ok) throw new Error(`npm registry: ${res.status} for wonder-blocks-${pkg}`);
    return ((await res.json()) as {version: string}).version;
}

async function check(): Promise<number> {
    const guide = fs.readFileSync(GUIDE_SRC, "utf8");
    const v = readVersions(guide);
    const current = readImportMap(guide);
    const {map, unhandled, notes} = await computeImportMap(v);
    const diff = diffMaps(current, map);
    for (const n of notes) console.log(`note: ${n} (harmless unless it holds React state)`);
    const newer = (await Promise.all(Object.keys(v).map(async (p) => [p, await latest(p)] as const))).filter(([p, l]) => l !== v[p]);
    if (newer.length) console.log(`newer on npm: ${newer.map(([p, l]) => `${p} ${v[p]} -> ${l}`).join(", ")} (run "update" to adopt)`);
    if (unhandled.length) console.error(`UNHANDLED (needs a new rule in this script or an import-map entry):\n  ${unhandled.join("\n  ")}`);
    if (diff.length) console.error(`import map in ${path.relative(ROOT, GUIDE_SRC)} is out of date:\n  ${diff.join("\n  ")}`);
    if (!unhandled.length && !diff.length) console.log(`OK: the import map matches V (${Object.keys(current).length} entries).`);
    return unhandled.length || diff.length ? 1 : 0;
}

async function update(): Promise<number> {
    let guide = fs.readFileSync(GUIDE_SRC, "utf8");
    const old = readVersions(guide);
    const v: Versions = {};
    for (const p of Object.keys(old)) v[p] = await latest(p);
    const {map, unhandled, notes} = await computeImportMap(v);
    for (const n of notes) console.log(`note: ${n}`);
    if (unhandled.length) {
        console.error(`Not writing: unhandled modules:\n  ${unhandled.join("\n  ")}`);
        return 1;
    }
    guide = guide.replace(V_LINE, formatVersions(v)).replace(MAP_BLOCK, (_all, a: string, _b: string, c: string) => a + formatImportMap(map) + c);
    fs.writeFileSync(GUIDE_SRC, guide);
    const bumped = Object.keys(v).filter((p) => v[p] !== old[p]);
    console.log(bumped.length ? `Bumped: ${bumped.map((p) => `${p} ${old[p]} -> ${v[p]}`).join(", ")}` : "V already at latest.");
    console.log(`Wrote V and the import map (${Object.keys(map).length} entries) to ${path.relative(ROOT, GUIDE_SRC)}.`);
    console.log("Next: update the tested date in the guide, run `pnpm exports`, then `pnpm artifact:preview kitchen-sink` and click through both themes.");
    return 0;
}

/** The guide's page skeleton (the first ```html block), from the generated copy so template syntax is resolved. */
export function skeleton(guide: string): string {
    const m = guide.match(/```html\n([\s\S]*?)```/);
    if (!m) throw new Error("no ```html block in the guide");
    return m[1];
}

/** Swap the skeleton's sample app for the kitchen-sink app, keeping the boot exactly as published. */
export function kitchenSink(skel: string, app: string): string {
    const start = skel.indexOf("// ---------- end WB boot ----------");
    const end = skel.indexOf("} catch (e) {");
    if (start < 0 || end < 0) throw new Error("skeleton markers not found");
    return skel.slice(0, start) + "// ---------- end WB boot ----------\n" + app + "\n" + skel.slice(end);
}

/** Wrap an artifact fragment the way the host does, plus a recorder for errors (window.__errs) that's for testing only. */
export function wrapForPreview(fragment: string): string {
    const recorder = `<script>window.__errs=[];addEventListener("error",e=>__errs.push("error: "+(e.message||e.target&&e.target.src)),true);addEventListener("unhandledrejection",e=>__errs.push("rejection: "+(e.reason&&e.reason.message||e.reason)));addEventListener("securitypolicyviolation",e=>__errs.push("CSP: "+e.violatedDirective+" "+e.blockedURI));const _ce=console.error;console.error=(...a)=>{__errs.push("console.error: "+a.map(x=>x&&x.message||String(x)).join(" ").slice(0,300));_ce(...a)};</script>`;
    return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${ARTIFACT_CSP}"><meta name="viewport" content="width=device-width,initial-scale=1">${recorder}</head><body>\n${fragment}\n</body></html>\n`;
}

function preview(arg: string | undefined): void {
    let fragment: string;
    if (!arg || arg === "kitchen-sink") {
        const skel = skeleton(fs.readFileSync(GUIDE_OUT, "utf8"));
        fragment = arg ? kitchenSink(skel, fs.readFileSync(KITCHEN_SINK, "utf8")) : skel;
    } else {
        fragment = fs.readFileSync(path.resolve(arg), "utf8");
    }
    const page = wrapForPreview(fragment);
    const port = Number(process.env.PORT ?? 8765);
    http.createServer((_req, res) => {
        res.writeHead(200, {"content-type": "text/html; charset=utf-8", "cache-control": "no-store"});
        res.end(page);
    }).listen(port, () => {
        console.log(`Serving ${arg ?? "the guide's skeleton"} under the artifact CSP at http://localhost:${port}`);
        console.log("Check: no red error box, `window.__errs` is empty in the console, and both themes look right.");
    });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
    const [cmd, arg] = process.argv.slice(2);
    if (cmd === "check") process.exitCode = await check();
    else if (cmd === "update") process.exitCode = await update();
    else if (cmd === "preview") preview(arg);
    else {
        console.error("usage: node scripts/exports/artifact.ts check | update | preview [kitchen-sink | page.html]");
        process.exitCode = 2;
    }
}
