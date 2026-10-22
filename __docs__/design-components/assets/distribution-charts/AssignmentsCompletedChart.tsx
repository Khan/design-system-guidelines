import * as React from "react";
import {StyleSheet, css} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import {Heading, BodyText} from "@khanacademy/wonder-blocks-typography";
import {SingleSelect, OptionItem} from "@khanacademy/wonder-blocks-dropdown";
import IconButton from "@khanacademy/wonder-blocks-icon-button";
import {border, semanticColor, sizing} from "@khanacademy/wonder-blocks-tokens";
import chartBarBold from "@phosphor-icons/core/bold/chart-bar-bold.svg";
import tableBold from "@phosphor-icons/core/bold/table-bold.svg";
import downloadSimpleBold from "@phosphor-icons/core/bold/download-simple-bold.svg";

// Chart mark colors are primitives (Blue 50/40 for Emphasis, Gray 60/30 for
// comparison) until data visualization semantic tokens exist in Wonder Blocks.
// See the Color TODO in the Data visualization foundation.
const EMPHASIS = {fill: "#8DA2FF", outline: "#6C82FF"};
const COMPARISON = {fill: "#CBCBCD", outline: "#8A8B90"};

const TEXT = semanticColor.core.foreground.neutral.default;
const TEXT_SUBTLE = semanticColor.core.foreground.neutral.subtle;
const GRID = semanticColor.core.border.neutral.subtle;
const BASELINE = semanticColor.core.border.neutral.default;

type Range = {label: string; students: number; emphasized: boolean};

// School-wide example: 74 of 92 students completed five to eight assignments.
const data: Array<Range> = [
    {label: "none", students: 2, emphasized: false},
    {label: "1–2", students: 3, emphasized: false},
    {label: "3–4", students: 5, emphasized: false},
    {label: "5–6", students: 40, emphasized: true},
    {label: "7–8", students: 34, emphasized: true},
    {label: "9–10", students: 5, emphasized: false},
    {label: "11+", students: 3, emphasized: false},
];

const WIDTH = 640;
const LEFT = 56;
const RIGHT = 630;
const TOP = 24;
const BOTTOM = 220;
const MAX = 50;
const TICKS = [0, 10, 20, 30, 40, 50];
const y = (value: number) => BOTTOM - (value / MAX) * (BOTTOM - TOP);

function Bars(): React.ReactElement {
    const band = (RIGHT - LEFT) / data.length;
    const barWidth = band * 0.62;
    return (
        <svg
            viewBox={`0 0 ${WIDTH} 270`}
            width="100%"
            role="group"
            aria-label="Bar chart of students by number of assignments completed, school-wide"
        >
            {TICKS.map((tick) => (
                <g key={tick}>
                    <line
                        x1={LEFT}
                        x2={RIGHT}
                        y1={y(tick)}
                        y2={y(tick)}
                        style={{stroke: tick === 0 ? BASELINE : GRID}}
                        strokeDasharray={tick === 0 ? undefined : "3 3"}
                    />
                    <text
                        x={LEFT - 10}
                        y={y(tick) + 4}
                        textAnchor="end"
                        fontSize={12}
                        style={{fill: TEXT_SUBTLE}}
                    >
                        {tick}
                    </text>
                </g>
            ))}
            <text
                x={14}
                y={(TOP + BOTTOM) / 2}
                transform={`rotate(-90 14 ${(TOP + BOTTOM) / 2})`}
                textAnchor="middle"
                fontSize={12}
                style={{fill: TEXT_SUBTLE}}
            >
                Students
            </text>
            {data.map((range, i) => {
                const x = LEFT + i * band + (band - barWidth) / 2;
                const top = y(range.students);
                const r = Math.min(4, (BOTTOM - top) / 2);
                const color = range.emphasized ? EMPHASIS : COMPARISON;
                return (
                    <g
                        key={range.label}
                        className={`dv-bar ${css(styles.bar)}`}
                        tabIndex={0}
                        role="img"
                        aria-label={`${range.label === "none" ? "No" : range.label} assignments: ${range.students} students`}
                    >
                        <path
                            d={`M${x},${BOTTOM} V${top + r} Q${x},${top} ${x + r},${top} H${x + barWidth - r} Q${x + barWidth},${top} ${x + barWidth},${top + r} V${BOTTOM} Z`}
                            fill={color.fill}
                            stroke={color.outline}
                            strokeWidth={1}
                        />
                        <text
                            x={x + barWidth / 2}
                            y={top - 8}
                            textAnchor="middle"
                            fontSize={13}
                            fontWeight={range.emphasized ? 600 : 400}
                            style={{fill: range.emphasized ? TEXT : TEXT_SUBTLE}}
                        >
                            {range.students}
                        </text>
                        <text
                            x={x + barWidth / 2}
                            y={BOTTOM + 20}
                            textAnchor="middle"
                            fontSize={12}
                            style={{fill: TEXT_SUBTLE}}
                        >
                            {range.label}
                        </text>
                    </g>
                );
            })}
            <text
                x={(LEFT + RIGHT) / 2}
                y={BOTTOM + 44}
                textAnchor="middle"
                fontSize={12}
                style={{fill: TEXT_SUBTLE}}
            >
                Assignments completed
            </text>
        </svg>
    );
}

function DataTable(): React.ReactElement {
    return (
        <table className={css(styles.table)}>
            <thead>
                <tr>
                    <th scope="col" className={css(styles.th)}>
                        Assignments completed
                    </th>
                    <th scope="col" className={css(styles.th)}>
                        Students
                    </th>
                </tr>
            </thead>
            <tbody>
                {data.map((range) => (
                    <tr key={range.label}>
                        <td className={css(styles.td)}>{range.label}</td>
                        <td className={css(styles.td)}>{range.students}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/**
 * A school-wide "Assignments completed" distribution chart in a chart container,
 * built to the Chart container and Distribution charts guidelines. Used on
 * the Distribution charts page:
 *
 * ```mdx
 * import {AssignmentsCompletedChart} from "./assets/distribution-charts/AssignmentsCompletedChart";
 * <AssignmentsCompletedChart />
 * ```
 */
// Headings are h5/h6 so the demo stays out of the docs page's table of
// contents while keeping a real section heading and title for screen readers.
export function AssignmentsCompletedChart(): React.ReactElement {
    const [range, setRange] = React.useState("this-year");
    const [view, setView] = React.useState<"chart" | "table">("chart");

    return (
        <View style={styles.root}>
            <Heading size="medium" tag="h5" style={styles.sectionHeading}>
                Assignments completed
            </Heading>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Heading size="small" tag="h6">
                            Most students completed five to eight assignments
                        </Heading>
                        <BodyText size="small" style={styles.subtle}>
                            74 of 92 students
                        </BodyText>
                    </View>
                    <View style={styles.controls}>
                        <SingleSelect
                            aria-label="Date range for assignments completed"
                            placeholder="Date range"
                            selectedValue={range}
                            onChange={setRange}
                        >
                            <OptionItem label="This year" value="this-year" />
                            <OptionItem
                                label="Last 30 days"
                                value="last-30-days"
                            />
                        </SingleSelect>
                        <IconButton
                            icon={chartBarBold}
                            kind={view === "chart" ? "primary" : "secondary"}
                            actionType="neutral"
                            size="medium"
                            aria-label="Chart view"
                            aria-pressed={view === "chart"}
                            onClick={() => setView("chart")}
                        />
                        <IconButton
                            icon={tableBold}
                            kind={view === "table" ? "primary" : "secondary"}
                            actionType="neutral"
                            size="medium"
                            aria-label="Table view"
                            aria-pressed={view === "table"}
                            onClick={() => setView("table")}
                        />
                        <IconButton
                            icon={downloadSimpleBold}
                            kind="secondary"
                            actionType="neutral"
                            size="medium"
                            aria-label="Download assignments completed data"
                            onClick={() => {}}
                        />
                    </View>
                </View>
                <View style={styles.body}>
                    {view === "chart" ? <Bars /> : <DataTable />}
                </View>
                <BodyText size="small" style={[styles.subtle, styles.footer]}>
                    Updated Oct 20, 2026, 9:15 AM
                </BodyText>
            </View>
        </View>
    );
}

/**
 * Just the assignments completed chart, with its title and description but no
 * section heading, controls, or footer. Used under Chart anatomy:
 *
 * ```mdx
 * <AssignmentsCompletedChartOnly />
 * ```
 */
export function AssignmentsCompletedChartOnly(): React.ReactElement {
    return (
        <View style={styles.chartOnly}>
            <View>
                <Heading size="small" tag="h6">
                    Most students completed five to eight assignments
                </Heading>
                <BodyText size="small" style={styles.subtle}>
                    74 of 92 students
                </BodyText>
            </View>
            <Bars />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        width: "100%",
        gap: sizing.size_120,
    },
    sectionHeading: {
        color: TEXT,
    },
    container: {
        backgroundColor: semanticColor.core.background.base.default,
        border: `${border.width.thin} solid ${semanticColor.core.border.neutral.subtle}`,
        borderRadius: border.radius.radius_120,
        padding: sizing.size_200,
        gap: sizing.size_160,
    },
    header: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: sizing.size_120,
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
        gap: sizing.size_080,
    },
    subtle: {
        color: TEXT_SUBTLE,
    },
    body: {
        width: "100%",
    },
    chartOnly: {
        width: "100%",
        gap: sizing.size_160,
    },
    footer: {
        borderTop: `${border.width.thin} solid ${semanticColor.core.border.neutral.subtle}`,
        paddingTop: sizing.size_120,
    },
    bar: {
        cursor: "default",
        ":focus": {
            outline: `2px solid ${semanticColor.focus.outer}`,
            outlineOffset: 2,
        },
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        textAlign: "start",
        padding: `${sizing.size_080} 0`,
        color: TEXT_SUBTLE,
        fontWeight: "normal",
        borderBottom: `${border.width.thin} solid ${semanticColor.core.border.neutral.subtle}`,
    },
    td: {
        textAlign: "start",
        padding: `${sizing.size_080} 0`,
        color: TEXT,
        borderBottom: `${border.width.thin} solid ${semanticColor.core.border.neutral.subtle}`,
    },
});
