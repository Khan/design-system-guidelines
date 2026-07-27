import * as React from "react";
import {StyleSheet} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import {PhosphorIcon} from "@khanacademy/wonder-blocks-icon";
import {BodyText} from "@khanacademy/wonder-blocks-typography";
import {border, semanticColor, sizing} from "@khanacademy/wonder-blocks-tokens";
import checkBold from "@phosphor-icons/core/bold/check-bold.svg";
import xBold from "@phosphor-icons/core/bold/x-bold.svg";

type Props = {
    /**
     * The image source (an imported asset).
     */
    src: string;
    /**
     * Alt text describing the image for assistive technology.
     */
    alt: string;
    /**
     * The caption shown as real text beneath the image. For `type="do"` /
     * `type="dont"` it becomes the explanation appended after the "Do" /
     * "Don't" label in the bar instead.
     */
    caption: React.ReactNode;
    /**
     * How to frame the image. `"figure"` (the default) shows the caption as a
     * plain neutral `<figcaption>` beneath the image. `"do"` / `"dont"` replace
     * that caption with a labeled bar (green ✓ / red ✕) attached to the bottom
     * of the image, marking the example as recommended or discouraged usage.
     */
    type?: "figure" | "do" | "dont";
};

// The knockout foreground token reads white/light on the strong colored
// surfaces used by the "Do" / "Don't" bars.
const KNOCKOUT = semanticColor.core.foreground.knockout.default;

const barConfig = {
    do: {
        label: "Do",
        icon: checkBold,
        backgroundColor: semanticColor.core.background.success.default,
    },
    dont: {
        label: "Don't",
        icon: xBold,
        backgroundColor: semanticColor.core.background.critical.default,
    },
} as const;

/**
 * An image paired with a real-text caption for `.mdx` docs pages, replacing
 * captions that were previously baked into the image itself.
 *
 * Set `type="do"` or `type="dont"` to replace the neutral caption with a
 * labeled bar attached to the bottom of the image (matching the do/dont
 * language used elsewhere). The `caption` is appended after the "Do" / "Don't"
 * label as a short explanation.
 *
 * ```mdx
 * <Figure src={myImg} alt="…" caption="A short description of the example." />
 * <Figure src={dontImg} alt="…" caption="do this." type="dont" />
 * ```
 */
export default function Figure({
    src,
    alt,
    caption,
    type = "figure",
}: Props): React.ReactElement {
    const bar =
        type === "do"
            ? barConfig.do
            : type === "dont"
              ? barConfig.dont
              : null;

    return (
        <View style={styles.figure} tag="figure">
            <View style={styles.frame}>
                <img
                    src={src}
                    alt={alt}
                    // Drop the docs' default img rounding — the frame owns the
                    // corners (top from the image, bottom from the do/dont bar),
                    // so the image's own bottom corners must stay square to meet
                    // the bar flush.
                    style={{
                        width: "100%",
                        display: "block",
                        margin: 0,
                        borderRadius: 0,
                    }}
                />
                {bar && (
                    <View
                        style={[styles.bar, {backgroundColor: bar.backgroundColor}]}
                    >
                        <PhosphorIcon
                            icon={bar.icon}
                            size="small"
                            color={KNOCKOUT}
                            aria-hidden={true}
                        />
                        <BodyText size="small" weight="bold" style={styles.barLabel}>
                            {bar.label}
                            {caption ? <> — {caption}</> : null}
                        </BodyText>
                    </View>
                )}
            </View>
            {type === "figure" && (
                <BodyText
                    size="small"
                    tag="figcaption"
                    style={styles.caption}
                >
                    {caption}
                </BodyText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    figure: {
        marginBlock: sizing.size_400,
    },
    // Rounds the image corners and clips the do/dont bar so it reads as one
    // unit attached to the bottom edge.
    frame: {
        borderRadius: border.radius.radius_080,
        overflow: "hidden",
    },
    caption: {
        marginBlockStart: sizing.size_120,
        color: semanticColor.core.foreground.neutral.subtle,
    },
    bar: {
        flexDirection: "row",
        alignItems: "center",
        gap: sizing.size_080,
        paddingInline: sizing.size_160,
        paddingBlock: sizing.size_120,
    },
    barLabel: {
        color: KNOCKOUT,
        // Let a longer explanation wrap instead of overflowing the bar.
        flexShrink: 1,
        minWidth: 0,
    },
});
