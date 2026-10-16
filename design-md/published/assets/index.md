# Khan Academy assets

Official SVGs for Khan Academy concepts. Use these files instead of drawing
your own or swapping in a lookalike. Paths are relative to this file. When to
use each kind is in the core [DESIGN.md](../DESIGN.md#khan-academy-icons).

## Activities and progress icons

Each of these is a circled icon: the glyph inside a circle with a solid
"chonky" bottom edge. The circle's color is the learning state, so the files
already pair each glyph with the right state. Don't take the glyph out, put
it in a different circle, or draw your own circle around it.

The files use `thunderblocks` (light) colors. Every color in them is a
learning-state token, so for `syl-dark` surfaces swap each hex for its dark
value, using the tables below. Where CSS works, you can instead inline the
SVG and set each fill to the token's CSS variable,
`var(--wb-semanticColor-learning-…)`. In slides and image exports, edit the
hex values in the markup before you insert the file. Replace all colors in
one pass, not one at a time, because some dark values match other light
values.

### Activities

Content types and activities the learner hasn't started. They're all in the
**not started** state.

| Meaning | File | Size |
| --- | --- | --- |
| Article | [icons/activities/icon-article.svg](icons/activities/icon-article.svg) | 50×55 |
| Challenge | [icons/activities/icon-challenge.svg](icons/activities/icon-challenge.svg) | 50×55 |
| Course | [icons/activities/icon-course.svg](icons/activities/icon-course.svg) | 50×55 |
| Interactive | [icons/activities/icon-interactive.svg](icons/activities/icon-interactive.svg) | 50×55 |
| Khanmigo activity | [icons/activities/icon-khanmigo-activity.svg](icons/activities/icon-khanmigo-activity.svg) | 50×55 |
| Lesson | [icons/activities/icon-lesson.svg](icons/activities/icon-lesson.svg) | 50×55 |
| Mastery challenge | [icons/activities/icon-mastery-challenge.svg](icons/activities/icon-mastery-challenge.svg) | 50×55 |
| Mission complete | [icons/activities/icon-mission-complete.svg](icons/activities/icon-mission-complete.svg) | 50×55 |
| Practice | [icons/activities/icon-practice.svg](icons/activities/icon-practice.svg) | 50×55 |
| Project | [icons/activities/icon-project.svg](icons/activities/icon-project.svg) | 50×55 |
| Quiz | [icons/activities/icon-quiz.svg](icons/activities/icon-quiz.svg) | 50×55 |
| Talkthrough | [icons/activities/icon-talkthrough.svg](icons/activities/icon-talkthrough.svg) | 50×55 |
| Unit test | [icons/activities/icon-unit-test.svg](icons/activities/icon-unit-test.svg) | 50×55 |
| Unit | [icons/activities/icon-unit.svg](icons/activities/icon-unit.svg) | 50×55 |
| Video | [icons/activities/icon-video.svg](icons/activities/icon-video.svg) | 50×55 |

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
| Attempted | [icons/progress/icon-attempted.svg](icons/progress/icon-attempted.svg) | 50×55 | Attempted |
| Familiar | [icons/progress/icon-familiar.svg](icons/progress/icon-familiar.svg) | 50×55 | Attempted |
| Retry | [icons/progress/icon-retry.svg](icons/progress/icon-retry.svg) | 50×55 | Attempted |
| Proficient | [icons/progress/icon-proficient.svg](icons/progress/icon-proficient.svg) | 50×55 | Complete |
| Mastery | [icons/progress/icon-mastery.svg](icons/progress/icon-mastery.svg) | 50×55 | Complete |
| Complete | [icons/progress/icon-complete.svg](icons/progress/icon-complete.svg) | 50×55 | Complete |

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
| Gem | [icons/motivation/icon-gem.svg](icons/motivation/icon-gem.svg) | 56×56 |
| Streak | [icons/motivation/icon-streak.svg](icons/motivation/icon-streak.svg) | 56×56 |

## Confetti shapes

Decorative accents from the graphics palette. Always `aria-hidden`; they
never carry meaning. Use as-is in both themes.

| Meaning | File | Size |
| --- | --- | --- |
| Blast | [shapes/shape-blast.svg](shapes/shape-blast.svg) | 36×30 |
| Circle grid | [shapes/shape-circle-grid.svg](shapes/shape-circle-grid.svg) | 36×30 |
| Circle | [shapes/shape-circle.svg](shapes/shape-circle.svg) | 36×30 |
| Cloud | [shapes/shape-cloud.svg](shapes/shape-cloud.svg) | 36×30 |
| Clover | [shapes/shape-clover.svg](shapes/shape-clover.svg) | 36×30 |
| Double semi circle | [shapes/shape-double-semi-circle.svg](shapes/shape-double-semi-circle.svg) | 36×30 |
| Hourglass | [shapes/shape-hourglass.svg](shapes/shape-hourglass.svg) | 36×30 |
| Oval | [shapes/shape-oval.svg](shapes/shape-oval.svg) | 36×30 |
| Parallelogram | [shapes/shape-parallelogram.svg](shapes/shape-parallelogram.svg) | 36×30 |
| Pentagon | [shapes/shape-pentagon.svg](shapes/shape-pentagon.svg) | 36×30 |
| Rounded door | [shapes/shape-rounded-door.svg](shapes/shape-rounded-door.svg) | 36×30 |
| Spiral | [shapes/shape-spiral.svg](shapes/shape-spiral.svg) | 36×30 |
| Square | [shapes/shape-square.svg](shapes/shape-square.svg) | 36×30 |
| Star | [shapes/shape-star.svg](shapes/shape-star.svg) | 36×30 |
| Triangle | [shapes/shape-triangle.svg](shapes/shape-triangle.svg) | 36×30 |

## Brand marks

See [Brand marks](../DESIGN.md#brand-marks) in DESIGN.md for which file to use
on which theme.

| Mark | File |
| --- | --- |
| Khan Academy logo mark (light) | [brand/khan-academy-logo-mark.svg](brand/khan-academy-logo-mark.svg) |
| Khan Academy logo mark (dark) | [brand/khan-academy-logo-mark-on-dark.svg](brand/khan-academy-logo-mark-on-dark.svg) |
| Khanmigo | [brand/khanmigo.svg](brand/khanmigo.svg) |
