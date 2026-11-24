/** Reading and writing the generated output trees. */
import * as fs from "node:fs";
import * as path from "node:path";

export type GenerateResult = {
    written: Array<string>;
    deleted: Array<string>;
    unchanged: Array<string>;
};

/** Sorted, posix-style relative paths of every non-hidden file under `dir`. */
export function listFiles(dir: string): Array<string> {
    if (!fs.existsSync(dir)) {
        return [];
    }
    return fs
        .readdirSync(dir, {recursive: true, encoding: "utf8"})
        .filter((rel) => !rel.split(path.sep).some((part) => part.startsWith(".")))
        .filter((rel) => fs.statSync(path.join(dir, rel)).isFile())
        .map((rel) => rel.split(path.sep).join("/"))
        .sort();
}

/**
 * Makes `outDir` hold exactly `files`: writes what changed and deletes what
 * isn't listed, except paths `keep` accepts (hand-edited files that live
 * beside the output, such as a config).
 */
export function writeTree(
    outDir: string,
    files: Map<string, string | Buffer>,
    keep: (rel: string) => boolean = () => false,
): GenerateResult {
    const result: GenerateResult = {written: [], deleted: [], unchanged: []};
    for (const [rel, content] of files) {
        const target = path.join(outDir, rel);
        if (fs.existsSync(target) && fs.readFileSync(target).equals(Buffer.from(content))) {
            result.unchanged.push(rel);
            continue;
        }
        fs.mkdirSync(path.dirname(target), {recursive: true});
        fs.writeFileSync(target, content);
        result.written.push(rel);
    }
    for (const rel of listFiles(outDir)) {
        if (!files.has(rel) && !keep(rel)) {
            fs.rmSync(path.join(outDir, rel));
            result.deleted.push(rel);
        }
    }
    return result;
}
