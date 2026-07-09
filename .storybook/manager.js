/**
 * Configuration of storybook addons.
 */
import {addons} from "storybook/manager-api";
import {getStorybookTheme} from "./wb-storybook-themes";

/**
 * Configures a custom theme to add some minor WB branding to our Storybook
 * instance.
 * @see https://storybook.js.org/docs/react/configure/theming
 */
addons.setConfig({
    // Matches initialGlobals.theme in preview.tsx
    theme: getStorybookTheme("thunderblocks"),
    sidebar: {
        showRoots: true,
    },
});

// Listen to theme changes and update the Storybook UI theme dynamically
addons.register("theme", (api) => {
    api.on("globalsUpdated", ({globals}) => {
        addons.setConfig({theme: getStorybookTheme(globals.theme)});
    });
});
