---
title: "🤖 Agent Architecture"
---

# Agent Architecture

What actually determines agent behavior — and it's not the model. The harness (system prompts, tools, memory, orchestration) matters more than model choice. Context loss, not token limits, is why agents fail. Better tool loops beat better prompts.

## Notes

- [[harness-engineering|Harness Engineering]] — Everything between the model and the user: system prompts, tools, orchestration, hooks
- [[memory-management|Three Layers of Agent Memory]] — Active context, working state (files), and durable memory (skills)
- [[agentic-loops|Agentic Loops and Tool Use]] — Engineering loops that don't drift, repeat blindly, or lose the thread
- [[multi-agent-systems|Single vs. Multi-Agent Systems]] — When splitting across agents helps, and when it amplifies errors 17×

## Subsections

- [[agents/memory/index|Memory & State]] — Context compression, the LLM Wiki Pattern
- [[agents/evaluation/index|Evaluation]] — Agent GPA, self-improving agents
- [[agents/tooling/index|Tooling & MCP]] — MCP servers, FastMCP, tool design
