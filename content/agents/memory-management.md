---
title: Three Layers of Agent Memory
tags: [agents, memory, context, state]
date: 2026-04-28
---

# Three Layers of Agent Memory

Agents don't fail because they hit the token limit. They fail because they **lose the thread** — verbose tool traces and accumulated noise push the actual goal out of context. The fix is deliberate memory management across three layers.

## The Three Layers

### Layer 1 — Active Context (the prompt window)

What's in the model's attention right now. Finite. Expensive. Degrades as it fills with irrelevant content.

Strategies:
- **Reset** — clear the window, refill with original instructions and critical artifacts
- **Compact** — summarize older turns, keep recent turns intact
- **Rewind** — roll back to a known-good state when the agent goes off track

### Layer 2 — Working State (files on disk)

**Files make better memory than chat.** Write plans, TODOs, and intermediate results to `.md` files in the workspace rather than holding them in prompt memory. Deep agents use `write_todos` tools explicitly.

The extreme version: Recursive Language Models (RLMs) bypass token limits entirely by maintaining a persistent Python REPL that manages state and calls sub-LLMs as needed. RLMs maintain accuracy even at 1M token equivalent depth.

### Layer 3 — Durable Memory (skills)

Reusable workflows encoded as skills — trigger + reference manual + script. A skill for querying an internal API. A skill for a common multi-step task.

**Warning:** Auto-generated context files (`CLAUDE.md`, `agents.md`) loaded into every prompt are not free. They increase inference cost by ~20% and have been shown to *reduce* task success rates compared to no context file. Hand-craft them. Keep them minimal. Every line should earn its place.

## The Memory Mistake to Avoid

Overloading `CLAUDE.md` with everything you know. It's included in every single prompt. The cost compounds.

Better model: curated, load-bearing facts in `CLAUDE.md` + detailed skills loaded on demand.

## Self-Improving Memory Loop

```
1. Agent attempts complex task
2. Periodic nudge: "what would you do differently?"
3. Agent writes/updates a skill file
4. Next time: agent loads skill → does better
5. On failure: agent edits skill → loop continues
```

The outer loop makes the agent smarter over time. But **16% of skills reduce performance** — you must evaluate each one before promoting it to production.

## Related

- [[harness-engineering|Harness Engineering]]
- [[memory/llm-wiki-pattern|The LLM Wiki Pattern]]
- [[memory/context-compression|Context Compression]]
