<img width="1158" height="660" alt="DSG-start" src="https://github.com/user-attachments/assets/2fb1aea4-42ac-4020-8869-0afa802d07ac" />

# design-system-guidelines

This is a living reference for how we build UI at the component, foundation, and pattern level. It documents how things should work, surfaces what needs to change, and will track design debt as we find it.

## Running locally

After pulling the repo, install dependencies

```sh
pnpm install
```

Then start the Storybook server

```sh
pnpm start
```

It should launch the following URL, locked to port :**56789** so that it can coexist nicely with a locally running wonder-blocks Storybook

```sh
http://localhost:56789/
```

## MCP endpoint

While the Storybook is running, it serves an MCP endpoint for agents:

```
http://localhost:56789/mcp
```

For Claude Code:

```sh
claude mcp add --transport http design-guidelines http://localhost:56789/mcp
```
