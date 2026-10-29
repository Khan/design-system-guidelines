**Outcome: Incubate (17 / 27).** The need is real and spread across teams, but there's no research behind the pattern yet and the set isn't scoped. Keep surfaces in product code and rescore once the set is defined and a second team signs on.

This is a first pass. The proposer, a Wonder Blocks designer and a Wonder Blocks engineer still score independently and discuss any criterion where their scores differ by 2 or more.

## Component proposal: Scaffolding components for page surfaces

**Proposer:** Caitlyn Mayers, Design Infra (from Judge Trudy Ruling 2 / Follow-up 2)
**Problem:** Page-level surfaces (the practice content panel, sidebars, report panels) have no Wonder Blocks component, so teams either misuse `Card`, which is meant for grouping comparable items, or hand-build surfaces from tokens.
**Where it's used today:**
- `ContentPanelCard` (`libs/content/renderer/core/src/components/content-panel/content-panel-card.tsx`), built on WB `Card`, used by 11 content renderers: exercise and assessable-task question card, video, article, AI activity instructions, gap detector, grouped exercises, and loading placeholders. The content renderer libraries are imported by classroom-learner (61 files), khanacademy (30), classroom-teacher (12), classroom (3) and devadmin-content (4).
- Hand-built surfaces with `semanticColor.core.background.base.default` + `boxShadow.low` outside the content renderer *(inferred to be page surfaces from the code; not confirmed visually)*: pacing guide `mission-sidebar.tsx` and `assessments-report.tsx` (classroom-teacher), `intro-ground-rules.tsx` (assessments), the activate page (accounts, on `Card`).

**Where it's planned:** Not yet. No team has a dated need.
**Design links:** Surfaces and elevations guideline (describes content panels as Surface 2, Low elevation on busy pages); no Figma spec.
**Code links:** above; `ContentPanelCard` moved to WB Card in "Migrate custom cards to Wonder Blocks Card" (#5283), created 2026-06-15, last changed 2026-09-22.
**Live URLs:** practice in an assignment, and Browse Subjects practice, video and article pages (all in the prototype reference library).
**Started as a custom solution:** The surface did (a custom content-panel surface before #5283). The proposal itself is system-led, from Design Infra.

**Outcome:** Incubate. Every gate passes, but the total lands at 17: no research, low complexity and a single advocate keep it below New component.
**Next step:** Scope the set (which surfaces: content panel, sidebar, report panel, page shell?), confirm the hand-built surfaces above are the same need, and get a second team to sign on. Then rescore.

### Step 1: Gates
| Criterion | Minimum | Score | Evidence |
| --- | --- | --- | --- |
| Gap coverage | 1 | 2 | `Card` covers the look but not the job (Ruling 2), and composing `View` + tokens works but drifts: radii differ across the hand-built surfaces (`radius_080` vs `radius_120`). Partly covered. |
| Validation | 2 if custom | 1 | Shipped and stable in production (content panel since at least June 2026). No user research or A/B test found. *Treated as system-led, so no minimum applied; see closest call.* |
| Standards fit | 2 | 2 *(inferred)* | Matches the Surfaces and elevations guidance (Surface 2, Low elevation); `ContentPanelCard` renders a labelled `section`. No accessibility review found. |
| Reuse (x2) | 1 | 3 → 6 *(inferred)* | Content renderer surfaces reach 5 apps; hand-built surfaces in classroom-teacher, assessments and accounts suggest 3+ teams. |

### Step 2: Remaining criteria
| Criterion | Score | Evidence |
| --- | --- | --- |
| Well-solved pattern | 2 | Surface or panel containers are common in major design systems; no WAI-ARIA pattern applies. |
| Complexity | 1 | Mostly styling and layout: background, elevation, radius, padding, a borderless narrow-screen variant and a container query. No focus or state logic. |
| Domain value | 1 | Applies wherever content renders or a page needs a focal panel; no second team has asked yet. |
| Risk if left local | 2 | Noticeable inconsistency already: `Card` misused for a page surface (Ruling 2), and hand-built surfaces with different radii. |

**Total:** 17 / 27 (Gap 2 + Validation 1 + Standards 2 + Reuse 6 + Well-solved 2 + Complexity 1 + Domain 1 + Risk 2)
**Finish plan:** Not applicable (Incubate).
**Red flags considered:**
- **Configuration sprawl:** a "set" could become one component with many booleans; decide up front whether it's a few named surfaces or one surface with variants.
- **Content baked in:** `ContentPanelCard` carries content-panel specifics (a `banner` slot, a named container query). Those stay in product code; only the surface belongs in Wonder Blocks.
- **Single advocate:** only Design Infra so far.

**Evidence to collect:**
- **A second team's need:** classroom-teacher (pacing guide, reports) or assessments confirming their surfaces are the same thing would firm up Reuse at 3 and lift Domain value to 2.
- **Research:** any study or A/B test touching the practice surface would lift Validation to 2 or 3. Validation 3 plus Domain value 2 would take the total to 21, which is New component.
- **Accessibility review** of `ContentPanelCard` (landmark labelling, narrow-screen borderless variant, contrast against Surface 1) to confirm Standards fit.
- **Screens** of the hand-built surfaces, to confirm they're page surfaces and not cards.

**Closest call:** Validation. If reviewers treat this as a custom solution (the content panel was custom before #5283), the gate needs a 2, it scores 1, and the outcome is **Incubate and run research** before anything else. Either way it lands in Incubate; what differs is whether research comes first.
