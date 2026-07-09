import * as React from "react";
import {StyleSheet} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import {border, semanticColor, sizing} from "@khanacademy/wonder-blocks-tokens";

type Props = {
    /**
     * The live example to showcase — any React component(s). Centered inside
     * the container.
     */
    children: React.ReactNode;
};

/**
 * A presentational container for embedding live, interactive Wonder Blocks
 * examples inside `.mdx` docs pages.
 *
 * It uses the default Wonder Blocks surface background (so it responds to
 * theming), the standard 12px card radius, and clips its contents. Children
 * are centered with padding so a single component (e.g. a button) sits neatly
 * in the middle.
 *
 * ```mdx
 * <Demo>
 *     <Button kind="primary" onClick={() => {}}>Submit</Button>
 * </Demo>
 * ```
 */
export default function Demo({children}: Props): React.ReactElement {
    return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: semanticColor.core.background.base.default,
        borderRadius: border.radius.radius_120, // 12px
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        minHeight: sizing.size_960,
        paddingInline: sizing.size_400,
        paddingBlock: sizing.size_560,
        marginBlock: sizing.size_160,
    },
});
