import * as React from "react";
import {StyleSheet} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import {PhosphorIcon} from "@khanacademy/wonder-blocks-icon";
import {semanticColor, sizing} from "@khanacademy/wonder-blocks-tokens";
import warningCircleBold from "@phosphor-icons/core/bold/warning-circle-bold.svg";
import warningBold from "@phosphor-icons/core/bold/warning-bold.svg";
import checkCircleBold from "@phosphor-icons/core/bold/check-circle-bold.svg";
import infoBold from "@phosphor-icons/core/bold/info-bold.svg";
import batteryEmptyBold from "@phosphor-icons/core/bold/battery-empty-bold.svg";
import wifiSlashBold from "@phosphor-icons/core/bold/wifi-slash-bold.svg";
import confettiBold from "@phosphor-icons/core/bold/confetti-bold.svg";
import calendarBlankBold from "@phosphor-icons/core/bold/calendar-blank-bold.svg";
import {Do, Dont} from "./DoDont";

// The four banner variants share the same status colors across their type icon
// and their custom-icon counterexample, so users can see the icon — not the
// color — is what changes.
const CRITICAL = semanticColor.core.foreground.critical.default;
const WARNING = semanticColor.core.foreground.warning.default;
const SUCCESS = semanticColor.core.foreground.success.default;
const INSTRUCTIVE = semanticColor.core.foreground.instructive.default;

type IconSpec = {
    icon: typeof warningCircleBold;
    color: string;
    label: string;
};

// The system-defined type icons, one per banner variant, in severity order.
const systemIcons: Array<IconSpec> = [
    {icon: warningCircleBold, color: CRITICAL, label: "Critical error icon"},
    {icon: warningBold, color: WARNING, label: "Warning icon"},
    {icon: checkCircleBold, color: SUCCESS, label: "Success icon"},
    {icon: infoBold, color: INSTRUCTIVE, label: "Information icon"},
];

// Custom, context-specific icons that must NOT replace the type icons in the
// primary position (e.g. a calendar for maintenance dilutes the status types).
const customIcons: Array<IconSpec> = [
    {icon: batteryEmptyBold, color: CRITICAL, label: "Battery icon"},
    {icon: wifiSlashBold, color: WARNING, label: "Wifi off icon"},
    {icon: confettiBold, color: SUCCESS, label: "Confetti icon"},
    {icon: calendarBlankBold, color: INSTRUCTIVE, label: "Calendar icon"},
];

function IconRow({icons}: {icons: Array<IconSpec>}): React.ReactElement {
    return (
        <View style={styles.row}>
            {icons.map(({icon, color, label}) => (
                <PhosphorIcon
                    key={label}
                    icon={icon}
                    size="medium"
                    color={color}
                    aria-label={label}
                />
            ))}
        </View>
    );
}

/**
 * Iconography visual for the Banners doc page: a side-by-side comparison of the
 * system-defined type icons (Do) against custom, context-specific icons (Don't).
 *
 * ```mdx
 * <BannerIconography />
 * ```
 */
export function BannerIconography(): React.ReactElement {
    return (
        <View style={styles.container}>
            <View style={styles.column}>
                <Do />
                <IconRow icons={systemIcons} />
            </View>
            <View style={styles.column}>
                <Dont />
                <IconRow icons={customIcons} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
        gap: sizing.size_320,
    },
    column: {
        flexGrow: 1,
        flexBasis: 0,
        // Keep each column at least as wide as its icon row so it never
        // shrinks enough to overlap its neighbor; once both columns can't
        // fit side by side, the Don't column wraps below the Do column.
        minWidth: 180,
        alignItems: "center",
        gap: sizing.size_320,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: sizing.size_240,
    },
});
