import * as React from "react";
import {ResponsiveNavigationTabs} from "@khanacademy/wonder-blocks-tabs";
import {BodyText} from "@khanacademy/wonder-blocks-typography";

const sections = [
    {id: "account", label: "Account", content: "Name, email, and password."},
    {
        id: "personalization",
        label: "Personalization",
        content: "Avatar, theme, and language.",
    },
    {
        id: "notifications",
        label: "Notifications",
        content: "Email and in-app alerts.",
    },
];

/**
 * Live, stateful navigation tabs for the Tabs guideline page: the main
 * sections of a settings page. In a product each tab links to its own URL;
 * here link navigation is suppressed and the selected section's content is
 * shown below so the demo stays on the docs page.
 */
export function TabsDemo() {
    const [selectedTabId, setSelectedTabId] = React.useState("account");
    const selected = sections.find((s) => s.id === selectedTabId);
    return (
        <div
            // `sb-unstyled` opts out of Storybook's docs typography, which
            // otherwise adds list-item margins that misalign the tabs.
            className="sb-unstyled"
            style={{display: "flex", flexDirection: "column", gap: "16px", width: "100%"}}
            // Keep the demo links from navigating or scrolling the docs page.
            // Selection still updates through `onTabSelected`.
            onClickCapture={(e) => {
                if ((e.target as HTMLElement).closest("a")) {
                    e.preventDefault();
                }
            }}
        >
            <ResponsiveNavigationTabs
                aria-label="Settings"
                selectedTabId={selectedTabId}
                onTabSelected={setSelectedTabId}
                showDivider={true}
                tabs={sections.map(({id, label}) => ({
                    id,
                    label,
                    href: `#settings-${id}`,
                }))}
            />
            <BodyText>{selected?.content}</BodyText>
        </div>
    );
}
