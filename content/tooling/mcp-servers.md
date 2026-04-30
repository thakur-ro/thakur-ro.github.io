---
title: MCP Server Design
tags: [mcp, tooling, llm, api-design]
date: 2026-04-29
---

# MCP Server Design

The Model Context Protocol (MCP) is how LLMs talk to tools. An MCP server exposes a set of functions the model can call. Designing a good MCP server is mostly about designing good APIs — but the user is an LLM, not a human, which changes the constraints.

## The Three Rules

**1. The LLM reads your tool descriptions, not your docs.** If the description is vague, the model will call the tool wrong. If the description is too long, it dilutes the signal. One sentence per tool, maximum. Describe behavior, inputs, and side effects.

**2. Fewer, better tools beat many thin wrappers.** An OpenAPI spec with 47 endpoints becomes 47 tools the model has to choose between. The model degrades in tool selection as the count grows. Curate aggressively.

**3. Every tool should be safely retryable.** The model will call things it shouldn't, at the wrong time, with wrong arguments. Design for this. Idempotent operations, clear error messages with recovery instructions, no irreversible side effects without confirmation.

## The Two Anti-Patterns

**Wrappers all the way down** — wrapping an existing REST API as-is and exposing every endpoint as a tool. The model gets overwhelmed. Curate: expose the 5-10 operations the model actually needs, not the full API surface.

**Chattiness** — tools that require 6 sequential calls to accomplish one task. Each call costs latency and a model decision. Compose operations server-side; give the model a single high-level tool.

## Tool Description Template

```
<action> <object> [under what conditions]. 
Returns <output>. 
Requires <inputs>. 
[Side effects / limitations if non-obvious.]
```

Example:
> Upload a file as an attachment to a Confluence page. Returns attachment ID and filename. Requires absolute file path and target page ID. Does not create new versions of existing attachments — use update_attachment for that.

## FastMCP 3.0 Primitives

FastMCP 3.0 introduces three primitives above raw tool registration:

- **Components** — stateful resources (a database connection, a session, a cache)
- **Providers** — dynamic tool factories (generate tools from a schema at runtime)
- **ArgTransform** — input/output shaping (rename, validate, default-inject without changing the tool's core logic)

The `from_openapi()` bootstrap converts a full API spec into tools automatically — useful as a starting point, not as a final state. Follow with curation via `Tool.from_tool()` to rename, redescribe, and prune.

## MCP Apps (SEP-1865)

The newest development: MCP Apps turn a tool-calling session into a stateful interaction. The server maintains a state machine per session; tools can render interactive UI elements (forms, tables, confirmations) directly into the conversation. The model and user share a live interface, not just a list of function calls.

Practical use: instead of a model calling `create_report` and hoping the user approves the output later, an MCP App can present a draft, wait for user edits, and then finalize — all within the conversation flow.

## Related

- [[fastmcp|FastMCP 3.0]]
- [[agents/harness-engineering|Harness Engineering]]
