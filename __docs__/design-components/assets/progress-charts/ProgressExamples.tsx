import * as React from "react";
import {StyleSheet} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import {Heading, BodyText} from "@khanacademy/wonder-blocks-typography";
import {SingleSelect, OptionItem} from "@khanacademy/wonder-blocks-dropdown";
import IconButton from "@khanacademy/wonder-blocks-icon-button";
import {DueBadge} from "@khanacademy/wonder-blocks-badge";
import {
    border,
    fade,
    semanticColor,
    sizing,
} from "@khanacademy/wonder-blocks-tokens";
import downloadSimpleBold from "@phosphor-icons/core/bold/download-simple-bold.svg";

// Bar colors are primitives (Blue 50/40 for Single series, Magenta 30 for
// Motivation, Gray 10 for the target marker) until data visualization
// semantic tokens exist in Wonder Blocks. See the Color TODO in the Data
// visualization foundation.
const SINGLE = {fill: "#8DA2FF", outline: "#6C82FF"};
const MOTIVATION = {fill: "#E83FA4", outline: "#E83FA4"};
const MARKER = "#4A4C53";

const TEXT = semanticColor.core.foreground.neutral.default;
const TEXT_SUBTLE = semanticColor.core.foreground.neutral.subtle;
const HAIRLINE = semanticColor.core.border.neutral.subtle;

type BarProps = {
    value: number;
    goal: number;
    color: {fill: string; outline: string};
    valueText: string;
    target?: number;
};

// A progress bar that fills to the current value, with an optional today's
// target marker. The bar exposes its value to assistive tech as a progressbar.
function ProgressBar({
    value,
    goal,
    color,
    valueText,
    target,
}: BarProps): React.ReactElement {
    const pct = (n: number) => `${Math.min(n / goal, 1) * 100}%`;
    return (
        <View
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={goal}
            aria-valuenow={value}
            aria-valuetext={valueText}
            style={[
                styles.track,
                {
                    backgroundColor: fade(color.fill, 0.18),
                    borderColor: color.outline,
                },
            ]}
        >
            <View
                style={[
                    styles.fill,
                    {
                        width: pct(value),
                        backgroundColor: color.fill,
                        borderColor: color.outline,
                    },
                ]}
            />
            {target != null && (
                <View
                    aria-hidden={true}
                    style={[styles.marker, {left: pct(target)}]}
                />
            )}
        </View>
    );
}

/**
 * A large-container progress chart: the Grade level target on a teacher
 * report, with a labeled today's target marker. Used on the Progress charts
 * page:
 *
 * ```mdx
 * import {GradeLevelTargetExample} from "./assets/progress-charts/ProgressExamples";
 * <GradeLevelTargetExample />
 * ```
 */
export function GradeLevelTargetExample(): React.ReactElement {
    const [range, setRange] = React.useState("this-year");
    const value = 38;
    const goal = 70;
    const target = 35;
    return (
        <View style={styles.root}>
            <Heading size="medium" tag="h5" style={styles.text}>
                Grade level target
            </Heading>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Heading size="small" tag="h6">
                            3 skills ahead of target
                        </Heading>
                        <BodyText size="small" style={styles.subtle}>
                            {value} of {goal} skills · Target date May 29
                        </BodyText>
                    </View>
                    <View style={styles.controls}>
                        <SingleSelect
                            aria-label="Date range for grade level target"
                            placeholder="Date range"
                            selectedValue={range}
                            onChange={setRange}
                        >
                            <OptionItem label="This year" value="this-year" />
                            <OptionItem
                                label="This semester"
                                value="this-semester"
                            />
                        </SingleSelect>
                        <IconButton
                            icon={downloadSimpleBold}
                            kind="secondary"
                            actionType="neutral"
                            size="medium"
                            aria-label="Download grade level target data"
                            onClick={() => {}}
                        />
                    </View>
                </View>
                <View style={styles.chart}>
                    <ProgressBar
                        value={value}
                        goal={goal}
                        target={target}
                        color={SINGLE}
                        valueText={`${value} of ${goal} skills. Today's target is ${target}. 3 skills ahead of target.`}
                    />
                    <View style={styles.labels} aria-hidden={true}>
                        <View>
                            <BodyText size="xsmall" style={styles.subtle}>
                                0 skills
                            </BodyText>
                            <BodyText size="xsmall" style={styles.subtle}>
                                Sept 1
                            </BodyText>
                        </View>
                        <View
                            style={[
                                styles.markerLabel,
                                {left: `${(target / goal) * 100}%`},
                            ]}
                        >
                            <BodyText
                                size="xsmall"
                                weight="bold"
                                style={styles.text}
                            >
                                Today's target: {target}
                            </BodyText>
                            <BodyText size="xsmall" style={styles.subtle}>
                                Oct 20
                            </BodyText>
                        </View>
                        <View style={styles.endLabel}>
                            <BodyText size="xsmall" style={styles.subtle}>
                                {goal} skills
                            </BodyText>
                            <BodyText size="xsmall" style={styles.subtle}>
                                May 29
                            </BodyText>
                        </View>
                    </View>
                </View>
                <BodyText size="small" style={[styles.subtle, styles.footer]}>
                    Updated today, 9:15 AM
                </BodyText>
            </View>
        </View>
    );
}

/**
 * A small-container progress chart: the gem challenge on the student
 * dashboard. One bar and a few values, with no controls, legend, or marker.
 *
 * ```mdx
 * import {GemChallengeExample} from "./assets/progress-charts/ProgressExamples";
 * <GemChallengeExample />
 * ```
 */
export function GemChallengeExample(): React.ReactElement {
    const value = 52;
    const goal = 80;
    return (
        <View style={[styles.container, styles.small]}>
            <View>
                <Heading size="small" tag="h6">
                    Gem challenge
                </Heading>
                <BodyText size="small" style={styles.subtle}>
                    QAing
                </BodyText>
            </View>
            <ProgressBar
                value={value}
                goal={goal}
                color={MOTIVATION}
                valueText={`${value} of ${goal} gems`}
            />
            <View style={styles.row}>
                <DueBadge label="12 days left" />
                <BodyText size="small" weight="bold" style={styles.text}>
                    {value} of {goal} gems
                </BodyText>
            </View>
            <View style={styles.row}>
                <BodyText size="small" style={styles.text}>
                    Your contribution
                </BodyText>
                <BodyText size="small" style={styles.text}>
                    9 gems
                </BodyText>
            </View>
            <View style={styles.row}>
                <BodyText size="small" style={styles.text}>
                    Reward
                </BodyText>
                <BodyText size="small" style={styles.text}>
                    October certificate
                </BodyText>
            </View>
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
        width: "100%",
        backgroundColor: semanticColor.core.background.base.default,
        border: `${border.width.thin} solid ${HAIRLINE}`,
        borderRadius: border.radius.radius_120,
        padding: sizing.size_200,
        gap: sizing.size_160,
    },
    small: {
        maxWidth: 320,
        gap: sizing.size_120,
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
    chart: {
        gap: sizing.size_080,
    },
    track: {
        position: "relative",
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        overflow: "visible",
    },
    fill: {
        position: "absolute",
        insetBlock: -1,
        insetInlineStart: -1,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
    },
    marker: {
        position: "absolute",
        top: -6,
        bottom: -6,
        width: 3,
        marginInlineStart: -1.5,
        borderRadius: 2,
        backgroundColor: MARKER,
    },
    labels: {
        position: "relative",
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: 36,
    },
    markerLabel: {
        position: "absolute",
        top: 0,
        transform: "translateX(-50%)",
        alignItems: "center",
        whiteSpace: "nowrap",
    },
    endLabel: {
        alignItems: "flex-end",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: sizing.size_080,
    },
    footer: {
        borderTop: `${border.width.thin} solid ${HAIRLINE}`,
        paddingTop: sizing.size_120,
    },
});
