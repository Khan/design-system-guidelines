# Verdicts (Judge Trudy)

Design Infra's rulings on how Wonder Blocks is meant to be used, and the work those rulings create.

- **`verdicts.json`**: one entry per ruling. Each is tied to a component in code (package and export, or a file path for shared frontend code). It links to the guideline that covers it when one exists. Otherwise it carries Design Infra's own reason and is marked `missing_guidance`.
- **`follow-ups.json`**: work the rulings create: a Wonder Blocks gap, missing guidance, or a separate quality issue (such as accessibility) for the team that owns the code. Follow-ups start as `proposed` and are filed in the Wonder Blocks Jira project only after someone gives the green light for them.

- **`evaluations/`**: Wonder Blocks candidacy evaluations for gaps the rulings found, one dated file each (`<YYYY-MM-DD>-<slug>.md`). A rescore is a new file. Each is linked from its ruling and follow-up.

## Rules

- **Only Design Infra rules.** The rulers are listed in `verdicts.json`. A ruler may rule on a request they raised themselves.
- **A ruling is a reply that starts with `Ruling:`.** Discuss in the request's thread as long as you need. When a ruler has decided, they reply `Ruling: <not an issue | wb gap | drift | exemption approved | exemption denied> — <reason>`. Only that counts, and a ruler's newer `Ruling:` replaces an older one.
- **Requests come through #design-infra.** The prototype builder drafts them when a designer thinks a flagged item isn't an issue, asks for an exemption, or corrects Claude. Nothing in this folder changes until a ruler decides.
- **A verdict counts only when merged here** with `status: "confirmed"` and `approved_by` set to a ruler.
- **When a guideline and a verdict disagree,** the audit flags the conflict instead of choosing one. Fix one of them.
- **Regenerate the page.** After changing `verdicts.json` or `follow-ups.json`, run `pnpm verdicts:page` and commit the page. CI fails if it's out of date.
- **Keep matches narrow:** a pattern, not a whole component, so one ruling doesn't hide a different problem in the same file.

## Who reads it

The `ka-design-prototype-builder` skill's audit reads `verdicts.json` on every run, so every designer's prototype gets the same rulings.
