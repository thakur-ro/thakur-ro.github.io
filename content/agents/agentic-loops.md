---
title: Agentic Loops and Tool Use
tags: [agents, loops, tools, validation]
date: 2026-04-28
---

# Agentic Loops and Tool Use

**Better tool loops beat better prompts.**

The loop — how an agent decides what to do next, executes it, reads the result, and decides again — is where most agent failures happen. A well-designed loop recovers from errors. A poorly designed loop amplifies them.

## The Loop Progression

| Stage | What it adds |
|---|---|
| **Baseline** — naive retry | Just tries again on failure |
| **Cognitive discipline** | Forces structured thinking via JSON schemas before acting |
| **Environmental discipline** | Tests and CI physically block bad states |
| **Safety and friction** | Sandboxes autonomous actions, adds human checkpoints |

Most production agents are at stage 1 or 2. Stage 3 is where reliability actually improves.

## Four Principles for Loop Design

1. **Make the next action explicit** — the agent must name what it's about to do before doing it
2. **Make verification cheap** — a fast test or assertion, not a full re-run
3. **Make blind repetition hard** — require the agent to update its state before retrying
4. **Force learning from the environment** — feed tool output back into the next decision, not just into the context

## Define Validation Contracts First

The most important harness decision: **write validation contracts before implementation begins.**

Tests written after implementation don't catch bugs — they confirm the agent's choices. An adversarial validation contract written upfront forces the agent to prove correctness rather than rationalize it.

For calculations: define the invariants (what must always be true?) before the agent runs. Fail loudly when violated.

## Environment Feedback Quality

Tool output is part of the loop. Bad environment feedback breaks good loops:

- **Too verbose** — hundreds of lines of warnings push the goal out of context
- **Too terse** — agent can't diagnose what went wrong
- **Wrong level** — stack traces when you need a summary; summaries when you need details

Design tool outputs for the agent, not for humans.

## Related

- [[harness-engineering|Harness Engineering]]
- [[memory-management|Three Layers of Agent Memory]]
- [[multi-agent-systems|Single vs. Multi-Agent Systems]]
