import * as React from "react";
import {StyleSheet} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import {PhosphorIcon} from "@khanacademy/wonder-blocks-icon";
import {BodyText} from "@khanacademy/wonder-blocks-typography";
import {border, semanticColor, sizing} from "@khanacademy/wonder-blocks-tokens";
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
     * The caption shown as real text beneath the image.
     */
    caption: React.ReactNode;
    /**
     * When true, renders the caption as a "Don't" bar (red, with an ✕ icon)
     * attached to the bottom of the image instead of a neutral caption.
     */
    dont?: boolean;
};

// The knockout foreground token reads white/light on the strong critical
// surface used by the "Don't" bar.
const KNOCKOUT = semanticColor.core.foreground.knockout.default;

/**
 * An image paired with a real-text caption for `.mdx` docs pages, replacing
 * captions that were previously baked into the image itself.
 *
 * Pass `dont` to render the caption as a red "Don't" bar attached to the
 * bottom of the image (matching the do/dont language used elsewhere).
 *
 * ```mdx
 * <Figure src={myImg} alt="…" caption="A short description of the example." />
 * <Figure src={dontImg} alt="…" caption="Don't do this." dont={true} />
 * ```
 */
export default function Figure({
    src,
    alt,
    caption,
    dont = false,
}: Props): React.ReactElement {
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
                {dont && (
                    <View style={styles.dontBar}>
                        <PhosphorIcon
                            icon={xBold}
                            size="small"
                            color={KNOCKOUT}
                            aria-hidden={true}
                        />
                        <BodyText size="small" weight="bold" style={styles.dontText}>
                            {caption}
                        </BodyText>
                    </View>
                )}
            </View>
            {!dont && (
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
    // Rounds the image corners and clips the "Don't" bar so it reads as one
    // unit attached to the bottom edge.
    frame: {
        borderRadius: border.radius.radius_080,
        overflow: "hidden",
    },
    caption: {
        marginBlockStart: sizing.size_120,
        color: semanticColor.core.foreground.neutral.subtle,
    },
    dontBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: sizing.size_080,
        paddingInline: sizing.size_160,
        paddingBlock: sizing.size_120,
        backgroundColor: semanticColor.core.background.critical.default,
    },
    dontText: {
        color: KNOCKOUT,
    },
});
