# Product UI (Wonder Blocks codebases)

Read this together with the core
[DESIGN.md](https://khan.github.io/design-system-guidelines/design-md/DESIGN.md).
It covers production React UI in a codebase with Wonder Blocks installed.

**Use Wonder Blocks components and tokens directly. Don't re-create them from
the values in DESIGN.md.** The core file tells you what things should look
like; Wonder Blocks already implements it.

- **Components:** `Button`, `TextField`, `Banner`, `Badge`, `Card`, `Link`, and the rest, from `@khanacademy/wonder-blocks-*`. Use the component that fits before styling your own.
- **Tokens:** `semanticColor`, `font`, `sizing`, `border`, and `boxShadow` from `@khanacademy/wonder-blocks-tokens`. Pick semantic color tokens by role; don't use primitive colors.
- **Theme:** wrap the app in `<ThemeSwitcher theme="thunderblocks">` (or `syl-dark`) from `@khanacademy/wonder-blocks-theming`.
- **Text:** `Heading` and `BodyText` from `@khanacademy/wonder-blocks-typography`.
- **Icons:** `PhosphorIcon` from `@khanacademy/wonder-blocks-icon` with icons from `@phosphor-icons/core`.

**Where to look:**

- The `wonder-blocks` agent skill (`.agents/skills/wonder-blocks/SKILL.md` in [Khan/wonder-blocks](https://github.com/Khan/wonder-blocks)): component and token usage in React.
- [Wonder Blocks `AGENTS.md`](https://github.com/Khan/wonder-blocks/blob/main/AGENTS.md): agent setup, including the Storybook MCP at `http://localhost:6061/mcp`.
- The published Wonder Blocks Storybook: <https://khan.github.io/wonder-blocks/> (theme toolbar: "Shape Your Learning").
- Usage guidelines: <https://khan.github.io/design-system-guidelines/>, also served by the `design-guidelines` MCP (`docs-list`, `docs-show`). Check documented props there instead of guessing.
