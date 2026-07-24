import * as React from "react";
import {PhosphorIcon} from "@khanacademy/wonder-blocks-icon";
import {semanticColor} from "@khanacademy/wonder-blocks-tokens";
import checkCircleFill from "@phosphor-icons/core/fill/check-circle-fill.svg";
import xCircleFill from "@phosphor-icons/core/fill/x-circle-fill.svg";

/**
 * Inline marker for a recommended ("Do") usage example — a green filled
 * check-circle. Pair alongside a good example in docs pages.
 *
 * ```mdx
 * <Banner ... />
 * <Do />
 * ```
 */
export function Do(): React.ReactElement {
    return (
        <PhosphorIcon
            icon={checkCircleFill}
            size="medium"
            color={semanticColor.core.background.success.default}
            aria-label="Do"
        />
    );
}

/**
 * Inline marker for a discouraged ("Don't") usage example — a red filled
 * x-circle. Pair alongside a bad example in docs pages.
 *
 * ```mdx
 * <Banner ... />
 * <Dont />
 * ```
 */
export function Dont(): React.ReactElement {
    return (
        <PhosphorIcon
            icon={xCircleFill}
            size="medium"
            color={semanticColor.core.background.critical.default}
            aria-label="Don't"
        />
    );
}
