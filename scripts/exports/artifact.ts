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
 *   node scripts/exports/artifact.ts outdated  Markdown list of Wonder Blocks packages behind npm (the guide's V and the
 *                                              installed tokens); prints nothing when all are current. Used by
 *                                              .github/workflows/wb-release-check.yml
 *   node scripts/exports/artifact.ts preview [kitchen-sink | design-system | path/to/page.html]
 *                                              serve a page under the artifact CSP at http://localhost:8765
 *                                              (design-system: every card of the Claude Design System in exports/claude-design-system/project/)
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
const DS_PROJECT = path.join(ROOT, "exports/claude-design-system/project");
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

/** Which pinned Wonder Blocks versions are behind npm: the guide's V (components on the CDN) and the installed tokens. */
async function outdated(): Promise<number> {
    const v = readVersions(fs.readFileSync(GUIDE_SRC, "utf8"));
    const lines: string[] = [];
    for (const [p, cur] of Object.entries(v)) {
        const l = await latest(p);
        if (l !== cur) lines.push(`- \`wonder-blocks-${p}\` in the Claude artifact guide's \`V\`: ${cur} → ${l}`);
    }
    const tokensPkg = JSON.parse(fs.readFileSync(path.join(ROOT, "node_modules/@khanacademy/wonder-blocks-tokens/package.json"), "utf8")) as {version: string};
    const lt = await latest("tokens");
    if (lt !== tokensPkg.version) lines.push(`- \`wonder-blocks-tokens\` installed (DESIGN.md and tokens.json values): ${tokensPkg.version} → ${lt}`);
    if (lines.length) console.log(lines.join("\n"));
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

const RECORDER = `<script>window.__errs=[];addEventListener("error",e=>__errs.push("error: "+(e.message||e.target&&e.target.src)),true);addEventListener("unhandledrejection",e=>__errs.push("rejection: "+(e.reason&&e.reason.message||e.reason)));addEventListener("securitypolicyviolation",e=>__errs.push("CSP: "+e.violatedDirective+" "+e.blockedURI));const _ce=console.error;console.error=(...a)=>{__errs.push("console.error: "+a.map(x=>x&&x.message||String(x)).join(" ").slice(0,300));_ce(...a)};</script>`;

/** Wrap an artifact fragment the way the host does, plus a recorder for errors (window.__errs) that's for testing only. */
export function wrapForPreview(fragment: string): string {
    return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${ARTIFACT_CSP}"><meta name="viewport" content="width=device-width,initial-scale=1">${RECORDER}</head><body>\n${fragment}\n</body></html>\n`;
}

/**
 * A Design System card (a complete document) the way the system's page frames
 * it: the artifact CSP, the system's tokens.css preloaded, and
 * `<html data-theme="light">` (or "dark" when the URL hash is #dark).
 */
export function wrapCardForPreview(card: string, tokensCss: string): string {
    const head =
        `<meta http-equiv="Content-Security-Policy" content="${ARTIFACT_CSP}">${RECORDER}` +
        `<script>document.documentElement.setAttribute("data-theme", location.hash === "#dark" ? "dark" : "light")</script>` +
        `<style>${tokensCss.replace(/<\/style/gi, "<\\/style")}</style>`;
    if (!/<head>/i.test(card)) throw new Error("a Design System card must be a complete document with a <head>");
    return card.replace(/<head>/i, (h) => h + head);
}

/** An index page that frames every card of the Claude Design System, light and dark. */
function designSystemIndex(cards: string[]): string {
    const frames = cards
        .map((c) => `<section><h2>${c}</h2><div class="pair"><iframe src="/card/${c}#light" title="${c} light"></iframe><iframe src="/card/${c}#dark" title="${c} dark"></iframe></div></section>`)
        .join("\n");
    return `<!doctype html><html><head><meta charset="utf-8"><title>Design System cards</title><style>body{font:14px system-ui;margin:16px}h2{font-size:14px;margin:16px 0 4px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:8px}iframe{width:100%;height:300px;border:1px solid #ccc}</style></head><body><h1>Claude Design System cards (light | dark)</h1>${frames}</body></html>`;
}

function preview(arg: string | undefined): void {
    if (arg === "design-system") return previewDesignSystem();
    // Built on every request, so a regenerated guide or an edited page shows up on reload.
    const page = (): string => {
        if (!arg || arg === "kitchen-sink") {
            const skel = skeleton(fs.readFileSync(GUIDE_OUT, "utf8"));
            return wrapForPreview(arg ? kitchenSink(skel, fs.readFileSync(KITCHEN_SINK, "utf8")) : skel);
        }
        return wrapForPreview(fs.readFileSync(path.resolve(arg), "utf8"));
    };
    page();
    const port = Number(process.env.PORT ?? 8765);
    http.createServer((_req, res) => {
        let body: string;
        try {
            body = page();
        } catch (e) {
            res.writeHead(500, {"content-type": "text/plain"}).end(String(e));
            return;
        }
        res.writeHead(200, {"content-type": "text/html; charset=utf-8", "cache-control": "no-store"});
        res.end(body);
    }).listen(port, () => {
        console.log(`Serving ${arg ?? "the guide's skeleton"} under the artifact CSP at http://localhost:${port}`);
        console.log("Check: no red error box, `window.__errs` is empty in the console, and both themes look right.");
    });
}

function previewDesignSystem(): void {
    const dir = path.join(DS_PROJECT, "components");
    if (!fs.existsSync(dir)) throw new Error("no exports/claude-design-system/project/components; run pnpm exports");
    const cards = fs.readdirSync(dir).filter((c) => fs.existsSync(path.join(dir, c, "preview.html"))).sort((a, b) => (a === "Cover" ? -1 : b === "Cover" ? 1 : a < b ? -1 : 1));
    const port = Number(process.env.PORT ?? 8765);
    http.createServer((req, res) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const m = url.pathname.match(/^\/card\/([A-Za-z_$][\w$]*)$/);
        let body: string;
        if (url.pathname === "/") body = designSystemIndex(cards);
        else if (m && cards.includes(m[1])) {
            // Read on every request, so a re-run of `pnpm exports` shows up on reload.
            const tokensCss = fs.readFileSync(path.join(DS_PROJECT, "tokens.css"), "utf8");
            body = wrapCardForPreview(fs.readFileSync(path.join(dir, m[1], "preview.html"), "utf8"), tokensCss);
        } else {
            res.writeHead(404).end("not found");
            return;
        }
        res.writeHead(200, {"content-type": "text/html; charset=utf-8", "cache-control": "no-store"});
        res.end(body);
    }).listen(port, () => {
        console.log(`Serving ${cards.length} Design System cards under the artifact CSP at http://localhost:${port} (one card: /card/<Name>, add #dark for the dark theme)`);
        console.log("Check: every card renders in both themes, with no red error box and an empty `window.__errs` in each frame.");
    });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
    const [cmd, arg] = process.argv.slice(2);
    if (cmd === "check") process.exitCode = await check();
    else if (cmd === "update") process.exitCode = await update();
    else if (cmd === "outdated") process.exitCode = await outdated();
    else if (cmd === "preview") preview(arg);
    else {
        console.error("usage: node scripts/exports/artifact.ts check | update | outdated | preview [kitchen-sink | design-system | page.html]");
        process.exitCode = 2;
    }
}
