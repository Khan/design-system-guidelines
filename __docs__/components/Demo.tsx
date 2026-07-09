import * as React from "react";
import {StyleSheet} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import type {StyleType} from "@khanacademy/wonder-blocks-core";
import {PhosphorIcon} from "@khanacademy/wonder-blocks-icon";
import {BodyText} from "@khanacademy/wonder-blocks-typography";
import {border, semanticColor, sizing} from "@khanacademy/wonder-blocks-tokens";
import checkBold from "@phosphor-icons/core/bold/check-bold.svg";
import xBold from "@phosphor-icons/core/bold/x-bold.svg";

type Props = {
    /**
     * The live example to showcase — any React component(s).
     */
    children: React.ReactNode;
    /**
     * How to frame the example. `"demo"` (the default) is a plain container.
     * `"do"` and `"dont"` add a labeled bar across the bottom to mark the
     * example as recommended or discouraged usage.
     */
    type?: "demo" | "do" | "dont";
    /**
     * Additional styles merged into the content area (where `children` are
     * laid out), e.g. to add a `gap` between multiple examples.
     */
    style?: StyleType;
};

// The knockout foreground token reads white/light on strong colored surfaces,
// so it works for both the "do" and "dont" bars.
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
 * A presentational container for embedding live, interactive Wonder Blocks
 * examples inside `.mdx` docs pages.
 *
 * It uses the default Wonder Blocks surface background (so it responds to
 * theming), the standard 12px card radius, and clips its contents. Children
 * are centered with padding so a single component (e.g. a button) sits neatly
 * in the middle.
 *
 * Set `type="do"` or `type="dont"` to add a full-width bar across the bottom
 * labeling the example as recommended or discouraged usage.
 *
 * ```mdx
 * <Demo type="do">
 *     <Button kind="primary" onClick={() => {}}>Submit</Button>
 * </Demo>
 * ```
 */
export default function Demo({
    children,
    type = "demo",
    style,
}: Props): React.ReactElement {
    const bar =
        type === "do"
            ? barConfig.do
            : type === "dont"
              ? barConfig.dont
              : null;

    return (
        <View style={styles.container}>
            <View style={[styles.content, style]}>{children}</View>
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
                    </BodyText>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: semanticColor.core.background.base.default,
        borderRadius: border.radius.radius_080,
        overflow: "hidden",
        flexDirection: "column",
        minHeight: sizing.size_960,
        marginBlock: sizing.size_400,
    },
    content: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingInline: sizing.size_400,
        paddingBlock: sizing.size_960,
    },
    bar: {
        flexDirection: "row",
        alignItems: "center",
        gap: sizing.size_080,
        paddingInline: sizing.size_120,
        paddingBlock: sizing.size_080,
        color: KNOCKOUT,
    },
    barLabel: {
        color: KNOCKOUT,
    },
});
