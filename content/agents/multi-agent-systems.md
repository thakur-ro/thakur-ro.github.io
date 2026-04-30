---
title: Single vs. Multi-Agent Systems
tags: [agents, multi-agent, architecture]
date: 2026-04-28
---

# Single vs. Multi-Agent Systems

Multi-agent architectures are appealing in theory and disappointing in practice. The intuition — split context and tools across specialized subagents to outperform a single overloaded agent — breaks down quickly once you measure coordination cost.

## The Numbers

- **Once a single agent reaches 45% accuracy, adding agents stops helping.** Coordination overhead outweighs reasoning gains above that threshold.
- **Independent agents amplify errors 17×.** If Agent A produces an error with 10% probability and hands off to Agent B with the same error rate, the compounding makes the system *more* fragile, not less.

## When Multi-Agent Actually Helps

Two conditions must both be true:
1. The subtasks are **genuinely independent** (no shared state, no sequential dependency)
2. **Coordination cost is lower than the accuracy gain** from task decomposition

Splitting a sequential task into subagents adds orchestration overhead with no parallelism benefit.

## Architecture Determines Error Behavior

| Architecture | Error behavior |
|---|---|
| Single agent | Errors stay local, agent can self-correct |
| Sequential pipeline | Errors propagate and compound downstream |
| Parallel independent | Errors multiply across agents |
| Supervised orchestration | Errors caught at review checkpoints |

The goal is error correction, not error propagation. Design orchestration so the system catches errors before they compound.

## Practical Default

Start with a single, well-tuned agent. Add subagents only when:
- You have profiled the bottleneck and it's context/tool overload (not model quality)
- The subtasks are provably independent
- You can measure the coordination overhead vs. accuracy gain

## Related

- [[harness-engineering|Harness Engineering]]
- [[agentic-loops|Agentic Loops and Tool Use]]
- [[evaluation/agent-gpa|Agent GPA]]
