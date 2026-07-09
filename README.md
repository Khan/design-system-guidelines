# design-system-guidelines
This is a living reference for how we build UI at the component, foundation, and pattern level. It documents how things should work, surfaces what needs to change, and will track design debt as we find it.

## Running locally

```sh
pnpm install
pnpm start
```

The Storybook is always served on port **56789**: http://localhost:56789/

## MCP endpoint

While the Storybook is running, it serves an MCP endpoint for agents:

```
http://localhost:56789/mcp
```

For Claude Code:

```sh
claude mcp add --transport http design-guidelines http://localhost:56789/mcp
```
