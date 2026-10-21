import * as React from "react";
import {StyleSheet} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import {BodyText} from "@khanacademy/wonder-blocks-typography";
import {border, semanticColor, sizing} from "@khanacademy/wonder-blocks-tokens";

type Swatch = {
    /**
     * The primitive color name, e.g. `"Blue 50"`.
     */
    name: string;
    /**
     * The hex value used to fill the swatch, e.g. `"#8DA2FF"`.
     */
    hex: string;
};

type Props = {
    /**
     * The anchor id, so other pages can link straight to this role,
     * e.g. `"attention"` for `#attention`.
     */
    id: string;
    /**
     * The role name, e.g. `"Single series"`.
     */
    name: string;
    /**
     * The role's colors, in the order they're used. Leave empty for a role
     * that isn't defined yet; the card shows a dashed placeholder instead.
     */
    colors: Array<Swatch>;
    /**
     * When to use the role, in one short sentence. A prop rather than
     * children, so MDX doesn't wrap it in a spaced-out paragraph.
     */
    description: string;
    /**
     * Optional small print under the description, like which color is the
     * fill and which is the outline.
     */
    detail?: string;
};

/**
 * A compact card for one data visualization color role: a row of swatches on
 * the start side, and the role's name, use, and fill and outline colors on
 * the end side. Stack several to show every role at a glance:
 *
 * ```mdx
 * <ColorRole
 *     id="single-series"
 *     name="Single series"
 *     colors={[{name: "Blue 50", hex: "#8DA2FF"}, {name: "Blue 40", hex: "#6C82FF"}]}
 *     description="One quantity on the chart. This is the default."
 *     detail="Fill Blue 50, outline Blue 40"
 * />
 * ```
 */
export default function ColorRole({
    id,
    name,
    colors,
    description,
    detail,
}: Props): React.ReactElement {
    return (
        <View id={id} style={styles.card}>
            <View style={styles.swatches}>
                {colors.length ? (
                    colors.map((color, i) => (
                        <View
                            key={`${color.name}-${i}`}
                            role="img"
                            aria-label={`${color.name}, ${color.hex}`}
                            title={`${color.name} ${color.hex}`}
                            style={[styles.swatch, {backgroundColor: color.hex}]}
                        />
                    ))
                ) : (
                    <View
                        role="img"
                        aria-label="Colors not defined yet"
                        style={[styles.swatch, styles.placeholder]}
                    />
                )}
            </View>
            <View style={styles.content}>
                <BodyText tag="span" size="medium" weight="bold">
                    {name}
                </BodyText>
                <BodyText tag="span" size="small" style={styles.subtle}>
                    {description}
                </BodyText>
                {detail && (
                    <BodyText tag="span" size="xsmall" style={styles.subtle}>
                        {detail}
                    </BodyText>
                )}
            </View>
        </View>
    );
}

/**
 * Stacks color role cards with even spacing.
 */
export function ColorRoleList({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement {
    return <View style={styles.list}>{children}</View>;
}

// The swatch column is a layout dimension, wide enough for four swatches so
// every card's text starts on the same line.
const SWATCH_COLUMN_WIDTH = 184;

const styles = StyleSheet.create({
    list: {
        gap: sizing.size_120,
        marginBlock: sizing.size_240,
    },
    card: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: sizing.size_240,
        paddingBlock: sizing.size_160,
        paddingInline: sizing.size_200,
        border: `${border.width.thin} solid ${semanticColor.core.border.neutral.subtle}`,
        borderRadius: border.radius.radius_120,
        backgroundColor: semanticColor.core.background.base.default,
        // Leave room above an anchored card so it isn't flush with the top.
        scrollMarginTop: sizing.size_240,
    },
    swatches: {
        flexDirection: "row",
        gap: sizing.size_080,
        width: SWATCH_COLUMN_WIDTH,
    },
    swatch: {
        width: sizing.size_400,
        height: sizing.size_400,
        borderRadius: border.radius.radius_080,
        // A subtle edge keeps light swatches visible on the card.
        border: `${border.width.thin} solid ${semanticColor.core.border.neutral.subtle}`,
    },
    placeholder: {
        borderStyle: "dashed",
        borderColor: semanticColor.core.border.neutral.default,
    },
    content: {
        flex: 1,
        minWidth: 200,
        gap: sizing.size_040,
    },
    subtle: {
        color: semanticColor.core.foreground.neutral.subtle,
    },
});
