import * as React from "react";
import {StyleSheet} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import {border, semanticColor, sizing} from "@khanacademy/wonder-blocks-tokens";

type Props = {
    /**
     * The primitive color name shown next to the square, e.g. `"Blue 50"`.
     */
    name: string;
    /**
     * The hex value used to fill the square, e.g. `"#8DA2FF"`.
     */
    hex: string;
};

/**
 * A small color square followed by the color's name, for use inside table
 * cells. Several in one cell stack one per line. Hover shows the hex value.
 *
 * ```mdx
 * | Fill |
 * | --- |
 * | <Swatch name="Blue 50" hex="#8DA2FF" /> |
 * ```
 */
export default function Swatch({name, hex}: Props): React.ReactElement {
    return (
        <View tag="span" style={styles.root} title={`${name} ${hex}`}>
            <View
                tag="span"
                aria-hidden={true}
                style={[styles.square, {backgroundColor: hex}]}
            />
            {name}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: sizing.size_080,
        // One swatch per line, with a little room between stacked ones.
        marginBlock: sizing.size_020,
    },
    square: {
        flexShrink: 0,
        width: sizing.size_200,
        height: sizing.size_200,
        borderRadius: border.radius.radius_040,
        // A subtle edge keeps light swatches visible on the page.
        border: `${border.width.thin} solid ${semanticColor.core.border.neutral.subtle}`,
    },
});
