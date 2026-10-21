import * as React from "react";
import {StyleSheet, css} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import {Heading, BodyText} from "@khanacademy/wonder-blocks-typography";
import {SingleSelect, OptionItem} from "@khanacademy/wonder-blocks-dropdown";
import IconButton from "@khanacademy/wonder-blocks-icon-button";
import {border, semanticColor, sizing} from "@khanacademy/wonder-blocks-tokens";
import chartLineBold from "@phosphor-icons/core/bold/chart-line-bold.svg";
import tableBold from "@phosphor-icons/core/bold/table-bold.svg";
import downloadSimpleBold from "@phosphor-icons/core/bold/download-simple-bold.svg";

// Line colors are primitives (Blue 40 line, Blue 50 fill for Single series)
// until data visualization semantic tokens exist in Wonder Blocks. See the
// Color TODO in the Data visualization foundation.
const LINE = "#6C82FF";
const FILL = "#8DA2FF";

const TEXT = semanticColor.core.foreground.neutral.default;
const TEXT_SUBTLE = semanticColor.core.foreground.neutral.subtle;
const GRID = semanticColor.core.border.neutral.subtle;
const SURFACE = semanticColor.core.background.base.default;

type Window = {label: string; score: number | null};

// Two assessment windows so far. End of year is labeled but not taken yet.
const data: Array<Window> = [
    {label: "Beginning of year", score: 735},
    {label: "Middle of year", score: 807},
    {label: "End of year", score: null},
];

const WIDTH = 640;
const LEFT = 56;
const RIGHT = 600;
const TOP = 24;
const BOTTOM = 210;
const MIN = 600;
const MAX = 900;
const TICKS = [600, 700, 800, 900];
const x = (i: number) => LEFT + (i * (RIGHT - LEFT)) / (data.length - 1);
const y = (v: number) => BOTTOM - ((v - MIN) / (MAX - MIN)) * (BOTTOM - TOP);

function Line(): React.ReactElement {
    const taken = data
        .map((d, i) => ({...d, i}))
        .filter((d): d is {label: string; score: number; i: number} =>
            d.score != null,
        );
    const path = taken.map((d, n) => `${n ? "L" : "M"}${x(d.i)},${y(d.score)}`);
    const area = `${path.join(" ")} L${x(taken[taken.length - 1].i)},${BOTTOM} L${x(taken[0].i)},${BOTTOM} Z`;
    return (
        <svg
            viewBox={`0 0 ${WIDTH} 274`}
            width="100%"
            role="group"
            aria-label="Line chart of average score by assessment window"
        >
            {TICKS.map((tick) => (
                <g key={tick}>
                    <line
                        x1={LEFT}
                        x2={RIGHT}
                        y1={y(tick)}
                        y2={y(tick)}
                        style={{stroke: GRID}}
                        strokeDasharray="3 3"
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
            <path d={area} fill={FILL} fillOpacity={0.18} />
            <path
                d={path.join(" ")}
                fill="none"
                stroke={LINE}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            {taken.map((d) => (
                <g
                    key={d.label}
                    className={css(styles.point)}
                    tabIndex={0}
                    role="img"
                    aria-label={`${d.label}: ${d.score}`}
                >
                    <circle
                        cx={x(d.i)}
                        cy={y(d.score)}
                        r={5}
                        fill={LINE}
                        style={{stroke: SURFACE}}
                        strokeWidth={2}
                    />
                    <text
                        x={x(d.i)}
                        y={y(d.score) - 12}
                        textAnchor="middle"
                        fontSize={13}
                        fontWeight={600}
                        style={{fill: TEXT}}
                    >
                        {d.score}
                    </text>
                </g>
            ))}
            {data.map((d, i) => (
                <text
                    key={d.label}
                    x={x(i)}
                    y={BOTTOM + 24}
                    textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
                    fontSize={12}
                    style={{fill: TEXT_SUBTLE}}
                >
                    {d.label}
                </text>
            ))}
            <text
                x={14}
                y={(TOP + BOTTOM) / 2}
                transform={`rotate(-90 14 ${(TOP + BOTTOM) / 2})`}
                textAnchor="middle"
                fontSize={12}
                style={{fill: TEXT_SUBTLE}}
            >
                Average score
            </text>
            <text
                x={(LEFT + RIGHT) / 2}
                y={BOTTOM + 52}
                textAnchor="middle"
                fontSize={12}
                style={{fill: TEXT_SUBTLE}}
            >
                Assessment window
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
                        Assessment
                    </th>
                    <th scope="col" className={css(styles.th)}>
                        Average score
                    </th>
                </tr>
            </thead>
            <tbody>
                {data.map((d) => (
                    <tr key={d.label}>
                        <td className={css(styles.td)}>{d.label}</td>
                        <td className={css(styles.td)}>{d.score ?? "—"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/**
 * A "Growth over time" trend chart in a large chart container, built to the
 * Chart container and Trend charts guidelines. Two assessment windows are
 * filled in, and the end-of-year window is labeled but empty. Used on the
 * Trend charts page:
 *
 * ```mdx
 * import {GrowthOverTimeChart} from "./assets/trend-charts/GrowthOverTimeChart";
 * <GrowthOverTimeChart />
 * ```
 */
// Headings are h5/h6 so the demo stays out of the docs page's table of
// contents while keeping a real section heading and title for screen readers.
export function GrowthOverTimeChart(): React.ReactElement {
    const [range, setRange] = React.useState("this-year");
    const [view, setView] = React.useState<"chart" | "table">("chart");
    return (
        <View style={styles.root}>
            <Heading size="medium" tag="h5" style={styles.text}>
                Growth over time
            </Heading>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Heading size="small" tag="h6">
                            Scores climbed 72 points since the last assessment
                        </Heading>
                        <BodyText size="small" style={styles.subtle}>
                            Average score, all students
                        </BodyText>
                    </View>
                    <View style={styles.controls}>
                        <SingleSelect
                            aria-label="Date range for growth over time"
                            placeholder="Date range"
                            selectedValue={range}
                            onChange={setRange}
                        >
                            <OptionItem label="This year" value="this-year" />
                            <OptionItem label="Last year" value="last-year" />
                        </SingleSelect>
                        <IconButton
                            icon={chartLineBold}
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
                            aria-label="Download growth over time data"
                            onClick={() => {}}
                        />
                    </View>
                </View>
                <View>{view === "chart" ? <Line /> : <DataTable />}</View>
                <BodyText size="small" style={[styles.subtle, styles.footer]}>
                    Updated today, 9:15 AM
                </BodyText>
            </View>
        </View>
    );
}

/**
 * Just the growth over time chart, with its title and description but no
 * section heading, controls, or footer. Used under Chart anatomy:
 *
 * ```mdx
 * <GrowthOverTimeChartOnly />
 * ```
 */
export function GrowthOverTimeChartOnly(): React.ReactElement {
    return (
        <View style={styles.chartOnly}>
            <View>
                <Heading size="small" tag="h6">
                    Scores climbed 72 points since the last assessment
                </Heading>
                <BodyText size="small" style={styles.subtle}>
                    Average score, all students
                </BodyText>
            </View>
            <Line />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        width: "100%",
        gap: sizing.size_120,
    },
    text: {
        color: TEXT,
    },
    subtle: {
        color: TEXT_SUBTLE,
    },
    container: {
        backgroundColor: SURFACE,
        border: `${border.width.thin} solid ${GRID}`,
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
    chartOnly: {
        width: "100%",
        gap: sizing.size_160,
    },
    footer: {
        borderTop: `${border.width.thin} solid ${GRID}`,
        paddingTop: sizing.size_120,
    },
    point: {
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
        borderBottom: `${border.width.thin} solid ${GRID}`,
    },
    td: {
        textAlign: "start",
        padding: `${sizing.size_080} 0`,
        color: TEXT,
        borderBottom: `${border.width.thin} solid ${GRID}`,
    },
});
