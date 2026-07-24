import * as React from "react";
import {StyleSheet} from "aphrodite";
import {View} from "@khanacademy/wonder-blocks-core";
import type {StyleType} from "@khanacademy/wonder-blocks-core";
import {PhosphorIcon} from "@khanacademy/wonder-blocks-icon";
import {semanticColor, sizing} from "@khanacademy/wonder-blocks-tokens";
import checkCircleFill from "@phosphor-icons/core/fill/check-circle-fill.svg";
import xCircleFill from "@phosphor-icons/core/fill/x-circle-fill.svg";

type IconProps = {
    /**
     * When `true`, the icon is purely decorative: it is hidden from assistive
     * tech (`aria-hidden`) and carries no label. Use this when a surrounding
     * element already announces the "Do this" / "Don't do this" meaning — e.g.
     * inside `UsageExample`, whose group label carries it. Defaults to `false`,
     * which keeps the labeled behavior for standalone inline use in lists.
     */
    decorative?: boolean;
    /**
     * The rendered icon size. Defaults to `"medium"`; use `"small"` when the
     * marker sits inline in a heading or dense text.
     */
    size?: React.ComponentProps<typeof PhosphorIcon>["size"];
};

/**
 * Inline marker for a recommended ("Do") usage — a green filled check-circle.
 *
 * Use it as a bullet-style marker inside prose lists of dos and don'ts:
 *
 * ```mdx
 * <ul>
 *     <li><Do /> Keep copy short and specific.</li>
 * </ul>
 * ```
 *
 * To pair a marker with a live example (rather than prose), reach for
 * `UsageExample`, which reuses this icon and adds the accessible connection.
 */
export function Do({
    decorative = false,
    size = "medium",
}: IconProps): React.ReactElement {
    return (
        <PhosphorIcon
            icon={checkCircleFill}
            size={size}
            color={semanticColor.core.background.success.default}
            aria-label={decorative ? undefined : "Do this"}
            aria-hidden={decorative || undefined}
        />
    );
}

/**
 * Inline marker for a discouraged ("Don't") usage — a red filled x-circle.
 *
 * Use it as a bullet-style marker inside prose lists of dos and don'ts:
 *
 * ```mdx
 * <ul>
 *     <li><Dont /> Cram multiple actions into one line.</li>
 * </ul>
 * ```
 *
 * To pair a marker with a live example (rather than prose), reach for
 * `UsageExample`, which reuses this icon and adds the accessible connection.
 */
export function Dont({
    decorative = false,
    size = "medium",
}: IconProps): React.ReactElement {
    return (
        <PhosphorIcon
            icon={xCircleFill}
            size={size}
            color={semanticColor.core.background.critical.default}
            aria-label={decorative ? undefined : "Don't do this"}
            aria-hidden={decorative || undefined}
        />
    );
}

type UsageExampleProps = {
    /**
     * Whether this example shows recommended (`"do"`) or discouraged
     * (`"dont"`) usage. Required — it is the whole point of the component.
     */
    type: "do" | "dont";
    /**
     * The example being judged — typically a small, inline live component.
     */
    children: React.ReactNode;
    /**
     * How to lay out the example and its marker. `"row"` (the default) sits
     * them side by side, with the marker trailing the example (its side flips
     * automatically in RTL). `"column"` stacks them, centered, with the marker
     * leading — so the "Do this" / "Don't do this" reads above the example.
     */
    direction?: "row" | "column";
    /**
     * Additional styles merged into the content area (where `children` are
     * laid out).
     */
    style?: StyleType;
};

const labels = {
    do: "Do this",
    dont: "Don't do this",
} as const;

/**
 * Pairs a small, inline example with a "Do this" / "Don't do this" marker,
 * binding the two together so the good/bad judgment is conveyed structurally —
 * not just by visual proximity. The wrapper is a labeled `role="group"`, so
 * assistive tech announces the meaning around the example, and tools parsing
 * the doc see one named element (with a `type` prop) wrapping the example.
 *
 * It reuses the `Do` / `Dont` icons for its marker, so all do/dont affordances
 * stay visually consistent.
 *
 * How this relates to the other do/dont mechanisms in these docs:
 * - `Demo type="do|dont"` judges a single, larger example at card scale (a
 *   full-width labeled bar). Use it when the example *is* the whole card.
 * - `UsageExample` judges smaller, inline examples that live *inside* a `Demo`,
 *   so several good/bad examples can sit together in one card.
 * - The bare `Do` / `Dont` icons are inline markers for prose lists.
 *
 * ```mdx
 * <Demo>
 *     <UsageExample type="do">
 *         <Banner ... />
 *     </UsageExample>
 *     <UsageExample type="dont">
 *         <Banner ... />
 *     </UsageExample>
 * </Demo>
 * ```
 */
export function UsageExample({
    type,
    children,
    direction = "row",
    style,
}: UsageExampleProps): React.ReactElement {
    const marker = type === "do" ? <Do decorative /> : <Dont decorative />;
    const isColumn = direction === "column";
    const content = <View style={[styles.content, style]}>{children}</View>;

    return (
        <View
            role="group"
            aria-label={labels[type]}
            data-example-type={type}
            style={[
                styles.container,
                {flexDirection: direction},
                isColumn ? styles.columnAlign : styles.rowAlign,
            ]}
        >
            {/* In a column the marker leads (reads above the example); in a row
                it trails the example. */}
            {isColumn ? (
                <>
                    {marker}
                    {content}
                </>
            ) : (
                <>
                    {content}
                    {marker}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: sizing.size_160,
        width: "100%",
    },
    rowAlign: {
        alignItems: "center",
    },
    columnAlign: {
        alignItems: "center",
    },
    content: {
        flexGrow: 1,
        minWidth: 0,
    },
});
