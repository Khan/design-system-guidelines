import * as React from "react";
import {NeutralBadge, StatusBadge} from "@khanacademy/wonder-blocks-badge";
import {PhosphorIcon} from "@khanacademy/wonder-blocks-icon";
import checkCircleBold from "@phosphor-icons/core/bold/check-circle-bold.svg";
import warningBold from "@phosphor-icons/core/bold/warning-bold.svg";
import warningOctagonBold from "@phosphor-icons/core/bold/warning-octagon-bold.svg";

/**
 * Real Wonder Blocks badges for the Data tables page's In-cell visuals and
 * Flags tables, so the examples show the actual components instead of
 * describing them:
 *
 * ```mdx
 * | Status badge | A row's state | <CompletedBadge /> <InProgressBadge /> |
 * ```
 */

/** A row's state: done. */
export function CompletedBadge(): React.ReactElement {
    return (
        <StatusBadge
            kind="success"
            label="Completed"
            icon={<PhosphorIcon icon={checkCircleBold} />}
        />
    );
}

/** A row's state: started but not done. */
export function InProgressBadge(): React.ReactElement {
    return <NeutralBadge label="In progress" />;
}

type FlagProps = {
    /**
     * What happened, in words: "Rushed 3 times," not "3×."
     */
    label: string;
};

/** A Warning flag: someone may need help, but nothing has failed yet. */
export function WarningFlag({label}: FlagProps): React.ReactElement {
    return (
        <StatusBadge
            kind="warning"
            label={label}
            icon={<PhosphorIcon icon={warningBold} />}
        />
    );
}

/** A Critical flag: something already went wrong, or a deadline passed. */
export function CriticalFlag({label}: FlagProps): React.ReactElement {
    return (
        <StatusBadge
            kind="critical"
            label={label}
            icon={<PhosphorIcon icon={warningOctagonBold} />}
        />
    );
}
