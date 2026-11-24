# Khan Academy assets

Official SVGs for Khan Academy concepts. Use these files instead of drawing
your own or swapping in a lookalike. Paths are relative to this file. When to
use each kind is in the core [DESIGN.md](README.md#khan-academy-icons).

**Getting a file from this design system.** The files are uploads, so a
`read` by the paths below fails. Read `project/design-system.json`, take the
file's `blob` from `assetGroups.<Group>.files["<path below the group>"]`
(for example `assetGroups.Icons.files["progress/icon-complete.svg"].blob`),
and `read` that id as the `path`. In an artifact, inline the SVG markup or
use it as a `data:` URI; `https:` images are blocked.

## Activities and progress icons

Each of these is a circled icon: the glyph inside a circle with a solid
"chonky" bottom edge. The circle's color is the learning state, so the files
already pair each glyph with the right state. Don't take the glyph out, put
it in a different circle, or draw your own circle around it.

The files use `thunderblocks` (light) colors. Every color in them is a
learning-state token, so for `syl-dark` surfaces swap each hex for its dark
value, using the tables below. Where CSS works, you can instead inline the
SVG and set each fill to the token's CSS variable with
`style="fill: var(--wb-semanticColor-learning-…)"` on each shape. A CSS
variable doesn't work in the `fill="…"` attribute. In slides and image exports, edit the
hex values in the markup before you insert the file. Replace all colors in
one pass, not one at a time, because some dark values match other light
values.

### Activities

Content types and activities the learner hasn't started. They're all in the
**not started** state.

| Meaning | File | Size |
| --- | --- | --- |
| Article | [assets/Icons/activities/icon-article.svg](assets/Icons/activities/icon-article.svg) | 50×55 |
| Challenge | [assets/Icons/activities/icon-challenge.svg](assets/Icons/activities/icon-challenge.svg) | 50×55 |
| Course | [assets/Icons/activities/icon-course.svg](assets/Icons/activities/icon-course.svg) | 50×55 |
| Interactive | [assets/Icons/activities/icon-interactive.svg](assets/Icons/activities/icon-interactive.svg) | 50×55 |
| Khanmigo activity | [assets/Icons/activities/icon-khanmigo-activity.svg](assets/Icons/activities/icon-khanmigo-activity.svg) | 50×55 |
| Lesson | [assets/Icons/activities/icon-lesson.svg](assets/Icons/activities/icon-lesson.svg) | 50×55 |
| Mastery challenge | [assets/Icons/activities/icon-mastery-challenge.svg](assets/Icons/activities/icon-mastery-challenge.svg) | 50×55 |
| Mission complete | [assets/Icons/activities/icon-mission-complete.svg](assets/Icons/activities/icon-mission-complete.svg) | 50×55 |
| Practice | [assets/Icons/activities/icon-practice.svg](assets/Icons/activities/icon-practice.svg) | 50×55 |
| Project | [assets/Icons/activities/icon-project.svg](assets/Icons/activities/icon-project.svg) | 50×55 |
| Quiz | [assets/Icons/activities/icon-quiz.svg](assets/Icons/activities/icon-quiz.svg) | 50×55 |
| Talkthrough | [assets/Icons/activities/icon-talkthrough.svg](assets/Icons/activities/icon-talkthrough.svg) | 50×55 |
| Unit test | [assets/Icons/activities/icon-unit-test.svg](assets/Icons/activities/icon-unit-test.svg) | 50×55 |
| Unit | [assets/Icons/activities/icon-unit.svg](assets/Icons/activities/icon-unit.svg) | 50×55 |
| Video | [assets/Icons/activities/icon-video.svg](assets/Icons/activities/icon-video.svg) | 50×55 |

**Not started**

| Part | Token | Light (in the file) | Dark |
| --- | --- | --- | --- |
| Circle | `learning-background-progress-notStarted-default` | `#CBCBCD` | `#B5B6B9` |
| Edge | `learning-shadow-progress-notStarted-default` | `#717279` | `#4A4C53` |
| Glyph | `learning-foreground-progress-notStarted-strong` | `#4A4C53` | `#4A4C53` |

### Progress

Mastery levels and attempt states for content the learner has started.

| Meaning | File | Size | State |
| --- | --- | --- | --- |
| Attempted | [assets/Icons/progress/icon-attempted.svg](assets/Icons/progress/icon-attempted.svg) | 50×55 | Attempted |
| Familiar | [assets/Icons/progress/icon-familiar.svg](assets/Icons/progress/icon-familiar.svg) | 50×55 | Attempted |
| Retry | [assets/Icons/progress/icon-retry.svg](assets/Icons/progress/icon-retry.svg) | 50×55 | Attempted |
| Proficient | [assets/Icons/progress/icon-proficient.svg](assets/Icons/progress/icon-proficient.svg) | 50×55 | Complete |
| Mastery | [assets/Icons/progress/icon-mastery.svg](assets/Icons/progress/icon-mastery.svg) | 50×55 | Complete |
| Complete | [assets/Icons/progress/icon-complete.svg](assets/Icons/progress/icon-complete.svg) | 50×55 | Complete |

**Attempted** (attempted, familiar, retry)

| Part | Token | Light (in the file) | Dark |
| --- | --- | --- | --- |
| Circle | `learning-background-progress-attempted-default` | `#FEE7AD` | `#FCC539` |
| Edge | `learning-shadow-progress-attempted-default` | `#FCB706` | `#D69900` |
| Glyph | `learning-foreground-progress-attempted-strong` | `#966B00` | `#5F4500` |
| Glyph (light bars) | `learning-foreground-progress-attempted-subtle` | `#FDD673` | `#D69900` |

**Complete** (proficient, mastery, complete)

| Part | Token | Light (in the file) | Dark |
| --- | --- | --- | --- |
| Circle | `learning-background-progress-complete-default` | `#BCEBBB` | `#72BB82` |
| Edge | `learning-shadow-progress-complete-default` | `#579F6C` | `#3C6D4A` |
| Glyph | `learning-foreground-progress-complete-strong` | `#2C5037` | `#2C5037` |

## Motivation

Gems and streaks, without a circle. Multicolor; use them as-is in both
themes.

| Meaning | File | Size |
| --- | --- | --- |
| Gem | [assets/Icons/motivation/icon-gem.svg](assets/Icons/motivation/icon-gem.svg) | 56×56 |
| Streak | [assets/Icons/motivation/icon-streak.svg](assets/Icons/motivation/icon-streak.svg) | 56×56 |

## Confetti shapes

Decorative accents from the graphics palette. Always `aria-hidden`; they
never carry meaning. Use as-is in both themes.

| Meaning | File | Size |
| --- | --- | --- |
| Blast | [assets/Shapes/shape-blast.svg](assets/Shapes/shape-blast.svg) | 36×30 |
| Circle grid | [assets/Shapes/shape-circle-grid.svg](assets/Shapes/shape-circle-grid.svg) | 36×30 |
| Circle | [assets/Shapes/shape-circle.svg](assets/Shapes/shape-circle.svg) | 36×30 |
| Cloud | [assets/Shapes/shape-cloud.svg](assets/Shapes/shape-cloud.svg) | 36×30 |
| Clover | [assets/Shapes/shape-clover.svg](assets/Shapes/shape-clover.svg) | 36×30 |
| Double semi circle | [assets/Shapes/shape-double-semi-circle.svg](assets/Shapes/shape-double-semi-circle.svg) | 36×30 |
| Hourglass | [assets/Shapes/shape-hourglass.svg](assets/Shapes/shape-hourglass.svg) | 36×30 |
| Oval | [assets/Shapes/shape-oval.svg](assets/Shapes/shape-oval.svg) | 36×30 |
| Parallelogram | [assets/Shapes/shape-parallelogram.svg](assets/Shapes/shape-parallelogram.svg) | 36×30 |
| Pentagon | [assets/Shapes/shape-pentagon.svg](assets/Shapes/shape-pentagon.svg) | 36×30 |
| Rounded door | [assets/Shapes/shape-rounded-door.svg](assets/Shapes/shape-rounded-door.svg) | 36×30 |
| Spiral | [assets/Shapes/shape-spiral.svg](assets/Shapes/shape-spiral.svg) | 36×30 |
| Square | [assets/Shapes/shape-square.svg](assets/Shapes/shape-square.svg) | 36×30 |
| Star | [assets/Shapes/shape-star.svg](assets/Shapes/shape-star.svg) | 36×30 |
| Triangle | [assets/Shapes/shape-triangle.svg](assets/Shapes/shape-triangle.svg) | 36×30 |

## Brand marks

See [Brand marks](README.md#brand-marks) in DESIGN.md for which file to use
on which theme.

| Mark | File |
| --- | --- |
| Khan Academy logo mark (light) | [assets/Brand/khan-academy-logo-mark.svg](assets/Brand/khan-academy-logo-mark.svg) |
| Khan Academy logo mark (dark) | [assets/Brand/khan-academy-logo-mark-on-dark.svg](assets/Brand/khan-academy-logo-mark-on-dark.svg) |
| Khanmigo | [assets/Brand/khanmigo.svg](assets/Brand/khanmigo.svg) |
