import * as React from "react";
import {StyleSheet} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import type {StyleType} from "@khanacademy/wonder-blocks-core";
import Clickable from "@khanacademy/wonder-blocks-clickable";
import {BodyText} from "@khanacademy/wonder-blocks-typography";
import {PhosphorIcon} from "@khanacademy/wonder-blocks-icon";
import {announceMessage} from "@khanacademy/wonder-blocks-announcer";
import {border, semanticColor, sizing} from "@khanacademy/wonder-blocks-tokens";
import checkBold from "@phosphor-icons/core/bold/check-bold.svg";

type Props = {
    /**
     * The display name of the color, e.g. `"Orange"`.
     */
    title: string;
    /**
     * The hex value of the color, e.g. `"#F8551A"`. Used to fill the swatch
     * and shown beneath the title.
     */
    hex: string;
    /**
     * An optional semantic token name for the color, e.g.
     * `"semanticColor.core.background.instructive.default"`. When provided,
     * clicking the card copies this token instead of the raw hex value.
     */
    semanticToken?: string;
    /**
     * Additional styles merged into the card, e.g. to control its width when
     * laying several cards out in a grid.
     */
    style?: StyleType;
};

/**
 * A compact, clickable color swatch card for use across design guidelines
 * pages. It shows a color swatch, the color's title, and its hex value.
 *
 * Clicking (or activating) the card copies a value to the clipboard: the
 * `semanticToken` when one is provided, otherwise the `hex` value.
 *
 * ```mdx
 * <Color title="Orange" hex="#F8551A" />
 * <Color
 *     title="Instructive"
 *     hex="#1865F2"
 *     semanticToken="semanticColor.core.background.instructive.default"
 * />
 * ```
 */
export default function Color({
    title,
    hex,
    semanticToken,
    style,
}: Props): React.ReactElement {
    const [copied, setCopied] = React.useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );

    // Prefer the semantic token so consumers copy the themeable reference; fall
    // back to the raw hex when no token is associated with the color.
    const copyValue = semanticToken ?? hex;

    const handleClick = () => {
        // eslint-disable-next-line no-undef -- `navigator` is available in the browser.
        navigator.clipboard.writeText(copyValue);
        announceMessage({message: `Copied to clipboard: ${copyValue}`});

        // Briefly surface a checkmark to confirm the copy succeeded.
        setCopied(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => setCopied(false), 3000);
    };

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <Clickable
            style={styles.clickable}
            onClick={handleClick}
            aria-label={`Copy to clipboard: ${copyValue}`}
        >
            {({hovered, pressed}) => (
                <View
                    style={[
                        styles.card,
                        style,
                        hovered && styles.cardHovered,
                        pressed && styles.cardPressed,
                    ]}
                >
                    <View style={[styles.swatch, {backgroundColor: hex}]}>
                        {copied && (
                            <View style={styles.copiedChip}>
                                <PhosphorIcon
                                    icon={checkBold}
                                    size="small"
                                    color={
                                        semanticColor.core.foreground.knockout
                                            .default
                                    }
                                    aria-hidden={true}
                                />
                                <BodyText tag="span" size="xsmall">
                                    Copied
                                </BodyText>
                            </View>
                        )}
                    </View>
                    <View style={styles.content}>
                        <BodyText
                            tag="span"
                            size="medium"
                            weight="bold"
                            style={styles.title}
                        >
                            {title}
                        </BodyText>
                        {semanticToken && (
                            <BodyText
                                tag="span"
                                size="xsmall"
                                style={styles.token}
                            >
                                {/*
                                 * Show the END of the token (the distinguishing
                                 * part) instead of the boilerplate prefix:
                                 * `direction: rtl` (see styles.token) moves the
                                 * ellipsis to the start, and <bdi> isolates the
                                 * LTR token so the bidi algorithm keeps its
                                 * characters in reading order. `title` exposes
                                 * the full value on hover.
                                 */}
                                <bdi title={semanticToken}>
                                    <code>{semanticToken}</code>
                                </bdi>
                            </BodyText>
                        )}
                        <BodyText tag="span" size="xsmall" style={styles.hex}>
                            <code>{hex}</code>
                        </BodyText>
                    </View>
                </View>
            )}
        </Clickable>
    );
}

// The card's max width is a layout dimension rather than spacing, and sits
// above the sizing token scale (which tops out at 96px), so it's a plain
// constant — enough for the 16:9 swatch while keeping long tokens truncated.
const CARD_MAX_WIDTH = 200;

const styles = StyleSheet.create({
    // Clickable renders the semantic <button> and supplies the focus ring; the
    // card's visuals live on the inner View below so hover/press affordances can
    // react to Clickable's render-prop state. Round the ring to match the card.
    clickable: {
        display: "flex",
        borderRadius: border.radius.radius_080,
        // Reset the native <button>'s default `text-align: center`, which would
        // otherwise be inherited by the title and hex text below.
        textAlign: "start",
    },
    card: {
        boxSizing: "border-box",
        flexDirection: "column",
        alignItems: "stretch",
        // Cap the card width so a long token truncates instead of stretching
        // the card. Consumers can still override via `style` (e.g. width: 100%
        // inside a grid cell). This is a layout dimension above the sizing scale.
        maxWidth: CARD_MAX_WIDTH,
        gap: sizing.size_080,
        padding: sizing.size_120,
        border: `${sizing.size_010} solid ${semanticColor.core.border.neutral.subtle}`,
        borderRadius: border.radius.radius_080,
        // Smooth the hover/press affordance driven by Clickable's state.
        transition: "box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out",
    },
    // Surface Clickable's hovered/pressed state on the whole card so it reads as
    // a single interactive control (Clickable still supplies the focus ring). A
    // box-shadow ring is used instead of `borderColor` because the latter loses
    // to the `border` shorthand above under Aphrodite's rule ordering.
    cardHovered: {
        boxShadow: `0 0 0 ${sizing.size_020} ${semanticColor.core.border.instructive.default}`,
            borderColor: semanticColor.core.border.instructive.default,
    },
    cardPressed: {
        boxShadow: `0 0 0 ${sizing.size_020} ${semanticColor.core.border.instructive.strong}`,
        borderColor: semanticColor.core.border.instructive.strong,
    },
    swatch: {
        height: sizing.size_960,
        aspectRatio: "16 / 9",
        borderRadius: border.radius.radius_040,
        alignItems: "center",
        justifyContent: "center",
        marginBlockEnd: sizing.size_080,
        // Anchor the absolutely-positioned "Copied" chip.
        position: "relative",
    },
    copiedChip: {
        padding: sizing.size_040,
        borderRadius: border.radius.radius_040,
        backgroundColor: semanticColor.core.background.neutral.strong,
        color: semanticColor.core.foreground.knockout.default,
        flexDirection: "row",
        alignItems: "center",
        gap: sizing.size_040,
        position: "absolute",
        top: sizing.size_080,
        left: sizing.size_080,
    },
    content: {
        flexDirection: "column",
        // Allow the token line to shrink below its content size so it can
        // truncate rather than widen the card.
        minWidth: 0,
    },
    title: {
        color: semanticColor.core.foreground.neutral.strong,
    },
    token: {
        color: semanticColor.core.foreground.neutral.default,
        // Truncate to a single line, keeping the END of the token visible.
        display: "block",
        minWidth: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        direction: "rtl",
        textAlign: "left",
    },
    hex: {
        color: semanticColor.core.foreground.neutral.subtle,
    },
});
