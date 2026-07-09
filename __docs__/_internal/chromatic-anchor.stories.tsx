import type {Meta, StoryObj} from "@storybook/react-vite";

/**
 * Internal anchor story — not part of the documentation.
 *
 * Chromatic (our publish-only host) refuses to build a Storybook that
 * contains zero stories. This project is docs-only (MDX guideline pages),
 * so this single throwaway story exists purely to satisfy that build gate.
 *
 * It is tagged `!dev` so it never appears in the sidebar, and snapshots are
 * already disabled globally in `.storybook/preview.tsx`, so it renders
 * nothing meaningful and costs nothing. Do not add real content here — write
 * guideline docs as `.mdx` under `__docs__/design-*` instead.
 */
const meta = {
    title: "Internal/Chromatic Anchor",
    // `!dev` removes the entry from the sidebar while keeping it in the
    // built story index, which is all Chromatic needs to build.
    // `!autodocs` prevents an autodocs page being generated for it, which
    // would otherwise appear in the docs manifest the hosted MCP serves.
    tags: ["!dev", "!autodocs"],
} satisfies Meta;

export default meta;

export const Anchor: StoryObj = {
    render: () => <span>Chromatic build anchor — hidden from the sidebar.</span>,
};
