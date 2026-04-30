---
title: FastMCP 3.0
tags: [mcp, fastmcp, tooling, python]
date: 2026-04-29
---

# FastMCP 3.0

FastMCP is the de facto Python framework for building MCP servers. Version 3.0 introduced higher-level abstractions that make the gap between "working MCP server" and "well-designed MCP server" much smaller.

## Core Primitives

**Components** — stateful resources that persist across tool calls within a session. A database connection, an authenticated API client, a cache. Components let you initialize expensive resources once and share them across all tools.

**Providers** — dynamic tool factories. Instead of registering tools at startup, a Provider generates them at runtime based on some schema or configuration. Useful when the tool surface depends on what the connected system exposes (e.g., a different set of tools per user or per environment).

**ArgTransform** — middleware for tool arguments. Rename parameters (the model sees `page_title`, the API receives `title`), inject defaults, validate inputs, normalize formats — all without touching the core tool logic. Keeps tools clean and composable.

## The `from_openapi()` Bootstrap

```python
server = FastMCP.from_openapi(spec, client)
```

This converts an OpenAPI spec into an MCP server automatically. It's a starting point, not a final state. The output has too many tools, bad names, and descriptions that weren't written for LLMs. Follow with curation:

```python
curated_tool = Tool.from_tool(
    raw_tool,
    name="upload_document",           # rename
    description="Upload a file...",   # rewrite for LLM consumption
    exclude_args=["internal_id"],      # hide internal fields
)
```

## MCP Apps (SEP-1865)

MCP Apps extend the protocol to support stateful, interactive sessions. An MCP App is an MCP server that maintains a state machine per session and can render UI components (forms, tables, selections) directly in the conversation.

The pattern: instead of the model making a tool call and moving on, an App presents a UI element, waits for user interaction, receives the result, and continues. It's a structured conversation, not a fire-and-forget API call.

Use cases:
- Multi-step wizards (configure → preview → confirm → execute)
- Approval flows (model drafts → user reviews → execute)
- Interactive exploration (model queries → user filters → model refines)

## Related

- [[mcp-servers|MCP Server Design]]
