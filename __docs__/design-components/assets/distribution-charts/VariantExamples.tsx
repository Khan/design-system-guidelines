import * as React from "react";
import {StyleSheet, css} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import {Heading, BodyText} from "@khanacademy/wonder-blocks-typography";
import {semanticColor, sizing} from "@khanacademy/wonder-blocks-tokens";

// Placeholder grays until the Assessment and Mastery color roles are defined
// in the Data visualization foundation. Levels are told apart by their bands
// and labels, not by color.
const BAR = {fill: "#CBCBCD", outline: "#8A8B90"};
const EARLIER = {fill: "#E0E0E1", outline: "#8A8B90"};
const LATEST = {fill: "#A0A1A4", outline: "#717279"};

const TEXT = semanticColor.core.foreground.neutral.default;
const TEXT_SUBTLE = semanticColor.core.foreground.neutral.subtle;
const BASELINE = semanticColor.core.border.neutral.default;

type Level = {
    name: string;
    ranges: Array<{label: string; students: number}>;
};

// End of year scores for 29 students. Range boundaries line up with the level
// thresholds, so no range crosses two levels.
const levels: Array<Level> = [
    {
        name: "Beginning",
        ranges: [
            {label: "700–739", students: 2},
            {label: "740–784", students: 3},
        ],
    },
    {
        name: "Approaching",
        ranges: [
            {label: "785–801", students: 2},
            {label: "802–819", students: 4},
        ],
    },
    {
        name: "Demonstrating",
        ranges: [
            {label: "820–859", students: 7},
            {label: "860–900", students: 11},
        ],
    },
];

const WIDTH = 640;
const LEFT = 20;
const RIGHT = 620;
const TOP = 28;
const BOTTOM = 180;
const MAX = 12;
const y = (value: number) => BOTTOM - (value / MAX) * (BOTTOM - TOP);

function LevelBars(): React.ReactElement {
    const ranges = levels.flatMap((level) => level.ranges);
    const band = (RIGHT - LEFT) / ranges.length;
    const barWidth = band * 0.62;
    let index = 0;
    return (
        <svg
            viewBox={`0 0 ${WIDTH} 268`}
            width="100%"
            role="group"
            aria-label="Bar chart of students by overall score, grouped by level"
        >
            <line
                x1={LEFT}
                x2={RIGHT}
                y1={BOTTOM}
                y2={BOTTOM}
                style={{stroke: BASELINE}}
            />
            {levels.map((level) => {
                const first = index;
                const count = level.ranges.reduce((n, r) => n + r.students, 0);
                const bars = level.ranges.map((range) => {
                    const i = index++;
                    const x = LEFT + i * band + (band - barWidth) / 2;
                    const top = y(range.students);
                    return (
                        <g
                            key={range.label}
                            className={css(styles.bar)}
                            tabIndex={0}
                            role="img"
                            aria-label={`${level.name}, ${range.label}: ${range.students} students`}
                        >
                            <rect
                                x={x}
                                y={top}
                                width={barWidth}
                                height={BOTTOM - top}
                                rx={3}
                                fill={BAR.fill}
                                stroke={BAR.outline}
                            />
                            <text
                                x={x + barWidth / 2}
                                y={top - 8}
                                textAnchor="middle"
                                fontSize={13}
                                fontWeight={600}
                                style={{fill: TEXT}}
                            >
                                {range.students}
                            </text>
                            <text
                                x={x + barWidth / 2}
                                y={BOTTOM + 18}
                                textAnchor="middle"
                                fontSize={12}
                                style={{fill: TEXT_SUBTLE}}
                            >
                                {range.label}
                            </text>
                        </g>
                    );
                });
                const start = LEFT + first * band + 6;
                const end = LEFT + index * band - 6;
                const middle = (start + end) / 2;
                return (
                    <g key={level.name}>
                        {bars}
                        <line
                            x1={start}
                            x2={end}
                            y1={BOTTOM + 32}
                            y2={BOTTOM + 32}
                            style={{stroke: TEXT_SUBTLE}}
                        />
                        <text
                            x={middle}
                            y={BOTTOM + 52}
                            textAnchor="middle"
                            fontSize={13}
                            fontWeight={600}
                            style={{fill: TEXT}}
                        >
                            {level.name}
                        </text>
                        <text
                            x={middle}
                            y={BOTTOM + 70}
                            textAnchor="middle"
                            fontSize={12}
                            style={{fill: TEXT_SUBTLE}}
                        >
                            {count} students
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

/**
 * A distribution chart grouped by level, with its title and description. The
 * bars are placeholder gray until the Assessment and Mastery color roles are
 * defined. Used under Grouped by level on the Distribution charts page:
 *
 * ```mdx
 * <GroupedByLevelChart />
 * ```
 */
// Headings are h6 so the demo stays out of the docs page's table of contents.
export function GroupedByLevelChart(): React.ReactElement {
    return (
        <View style={styles.root}>
            <View>
                <Heading size="small" tag="h6">
                    18 of 29 students are at Demonstrating
                </Heading>
                <BodyText size="small" style={styles.subtle}>
                    Students by overall score, end of year
                </BodyText>
            </View>
            <LevelBars />
        </View>
    );
}

const periods = [
    {name: "Beginning of year", color: EARLIER},
    {name: "Middle of year", color: LATEST},
];

// The same 29 students took both assessments.
const levelCounts = [
    {name: "Beginning", counts: [12, 7]},
    {name: "Approaching", counts: [11, 10]},
    {name: "Demonstrating", counts: [6, 12]},
];
const PERIOD_MAX = 14;

/**
 * A distribution chart comparing two periods, one row per level, with both
 * bars starting at zero. The bars are placeholder gray until the Assessment
 * and Mastery color roles are defined. Used under Comparing periods on the
 * Distribution charts page:
 *
 * ```mdx
 * <ComparingPeriodsChart />
 * ```
 */
export function ComparingPeriodsChart(): React.ReactElement {
    return (
        <View style={styles.root}>
            <View>
                <Heading size="small" tag="h6">
                    6 more students reached Demonstrating since beginning of
                    year
                </Heading>
                <BodyText size="small" style={styles.subtle}>
                    29 students took both
                </BodyText>
            </View>
            <View style={styles.legend}>
                {periods.map((period) => (
                    <View key={period.name} style={styles.legendItem}>
                        <View
                            style={[
                                styles.swatch,
                                {
                                    backgroundColor: period.color.fill,
                                    borderColor: period.color.outline,
                                },
                            ]}
                        />
                        <BodyText size="small" style={styles.text}>
                            {period.name}
                        </BodyText>
                    </View>
                ))}
            </View>
            <View
                role="group"
                aria-label="Students at each level, beginning of year and middle of year"
                style={styles.rows}
            >
                {levelCounts.map((level) => (
                    <View key={level.name} style={styles.row}>
                        <BodyText
                            size="small"
                            weight="bold"
                            style={[styles.text, styles.rowName]}
                        >
                            {level.name}
                        </BodyText>
                        <View style={styles.pair}>
                            {level.counts.map((count, i) => (
                                <View
                                    key={periods[i].name}
                                    style={styles.barRow}
                                    tabIndex={0}
                                    role="img"
                                    aria-label={`${level.name}, ${periods[i].name}: ${count} students`}
                                >
                                    <View
                                        style={[
                                            styles.hbar,
                                            {
                                                width: `${(count / PERIOD_MAX) * 88}%`,
                                                backgroundColor:
                                                    periods[i].color.fill,
                                                borderColor:
                                                    periods[i].color.outline,
                                            },
                                        ]}
                                    />
                                    <BodyText
                                        size="small"
                                        weight="bold"
                                        style={styles.text}
                                    >
                                        {count}
                                    </BodyText>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        width: "100%",
        gap: sizing.size_160,
    },
    text: {
        color: TEXT,
    },
    subtle: {
        color: TEXT_SUBTLE,
    },
    bar: {
        ":focus": {
            outline: `2px solid ${semanticColor.focus.outer}`,
            outlineOffset: 2,
        },
    },
    legend: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: sizing.size_160,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: sizing.size_080,
    },
    swatch: {
        width: sizing.size_120,
        height: sizing.size_120,
        borderRadius: 3,
        borderWidth: 1,
        borderStyle: "solid",
    },
    rows: {
        gap: sizing.size_160,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: sizing.size_160,
    },
    rowName: {
        width: 120,
        flexShrink: 0,
    },
    pair: {
        flex: 1,
        gap: sizing.size_040,
    },
    barRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: sizing.size_080,
        ":focus": {
            outline: `2px solid ${semanticColor.focus.outer}`,
            outlineOffset: 2,
        },
    },
    hbar: {
        height: sizing.size_200,
        borderRadius: 3,
        borderWidth: 1,
        borderStyle: "solid",
    },
});
