---
title: Harness Engineering
tags: [agents, harness, system-prompts, tools, orchestration]
date: 2026-04-28
---

# Harness Engineering

The harness is everything between the model and the user: system prompts, tool definitions, orchestration logic, hooks, and bundled infrastructure. **The harness is the product.** A small model with a well-designed harness outperforms a large model with a poor one.

Manus rebuilt their harness five times in six months. System prompts are getting longer, not shorter. Harnesses have bugs just like code does.

## What's in a Harness

```
User
 │
 ▼
┌─────────────────────────────────────────┐
│              The Harness                │
│                                         │
│  • System prompts & instructions        │
│  • Tool definitions + descriptions      │
│  • Bundled infrastructure               │
│    (filesystem, sandbox, browser)       │
│  • Orchestration logic                  │
│    (subagent spawning, routing)         │
│  • Hooks & middleware                   │
│    (compaction, lint checks, retry)     │
└─────────────────────────────────────────┘
 │
 ▼
Foundation Model
```

## The Harness Has Bugs Too

A real example from Claude Code: a cache optimization accidentally evicted thinking blocks. A verbosity reduction degraded output quality. These aren't model bugs — they're harness bugs, and they're harder to detect because they don't throw exceptions.

> *"The thing you want to do is the minimal possible thing to get your model on track."* — Boris Cherny, creator of Claude Code

## Harness vs. Model

| What you control | What you're given |
|---|---|
| System prompt | Model weights |
| Tool descriptions | Model capabilities |
| Orchestration | Model latency/cost |
| Memory layers | Model knowledge cutoff |
| Validation contracts | Model failure modes |

The left column has more leverage than most teams realize.

## Three Retrieval Modes

Agents need to find information. Three modes, in order of precision vs. cost:

1. **BM25 / keyword** — grep, find, inverted index. Sub-second, battle-tested. Sufficient for many code search tasks.
2. **Semantic** — embeddings solve the synonym gap. Required when lexical search breaks down.
3. **Agentic search** — LLM-driven dynamic retrieval. Highest accuracy, highest latency. Agentic BM25 beats pure semantic on reasoning tasks.

Current best practice: [[retrieval/hybrid-search|hybrid search]] (dense + sparse + RRF) as a baseline.

## Related

- [[memory-management|Three Layers of Agent Memory]]
- [[agentic-loops|Agentic Loops and Tool Use]]
- [[multi-agent-systems|Single vs. Multi-Agent Systems]]
