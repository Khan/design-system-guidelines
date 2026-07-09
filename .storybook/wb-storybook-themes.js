import {create} from "storybook/theming";
import wbTokenValues from "./wb-token-values.gen";

const INSTRUCTIVE = "--wb-semanticColor-core-foreground-instructive-default";

/**
 * Builds the Storybook UI theme for a Wonder Blocks theme name, using the
 * WB "instructive" token as the accent so the Storybook chrome matches the
 * content pages. Token values come from wb-token-values.gen.js (regenerated
 * from the wonder-blocks-tokens package on every startup by main.ts).
 */
function makeTheme(wbTheme) {
    const instructive = wbTokenValues[wbTheme][INSTRUCTIVE];
    const dark = wbTheme === "syl-dark";

    return create({
        base: dark ? "dark" : "light",
        fontBase: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
        brandTitle: "Design Guidelines",
        brandUrl: "/",
        brandImage: dark
            ? "./logo-design-guidelines--dark.svg"
            : "./logo-design-guidelines.svg",
        colorPrimary: instructive,
        colorSecondary: instructive,
        barSelectedColor: instructive,
        barHoverColor: instructive,
        // App-wide background (sidebar, toolbar, content, and docs pages —
        // appContentBg flows into the docs container via docs.theme)
        ...(dark
            ? {}
            : {
                  appBg: "#EDEDEE",
                  appContentBg: "#EDEDEE",
                  appPreviewBg: "#EDEDEE",
                  barBg: "#EDEDEE",
              }),
    });
}

const themes = {
    "default": makeTheme("default"),
    "thunderblocks": makeTheme("thunderblocks"),
    "syl-dark": makeTheme("syl-dark"),
};

/**
 * Returns the Storybook UI theme matching a WB theme name, falling back to
 * the repo's default theme (thunderblocks).
 */
export function getStorybookTheme(wbTheme) {
    return themes[wbTheme] ?? themes["thunderblocks"];
}
