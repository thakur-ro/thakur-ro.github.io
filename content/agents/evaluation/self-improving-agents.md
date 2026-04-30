---
title: Self-Improving Agents
tags: [evaluation, agents, self-improvement, skills]
date: 2026-04-28
---

# Self-Improving Agents

An agent that evaluates its own failures and updates its behavior is qualitatively different from one that just retries. The outer loop — reflect, update, re-run — is what separates a system that plateaus from one that compounds.

## The Two Loops

**Inner loop** — finish the current task. Standard agentic execution.

**Outer loop** — after the task, reflect on what went wrong and update a skill or heuristic to do better next time.

The outer loop is optional in most frameworks. It's the difference between an agent that's good at one thing and an agent that gets better at everything.

## The Skill Update Pattern

1. Agent attempts a task and fails (or succeeds but inefficiently)
2. Periodic nudge: *"What would you do differently?"*
3. Agent drafts an updated skill — a markdown file with trigger, instructions, and examples
4. New skill is evaluated against held-out cases before promotion
5. On next similar task, agent loads the skill → improved performance

## The 16% Warning

Not all skills help. In benchmarked coding agent experiments, **16% of auto-generated skills reduced performance** compared to the agent without them. Skills that:
- Are too broad (trigger on everything)
- Contradict each other
- Encode a one-off solution as a general rule

...actively hurt the agent.

**Never promote a skill without evaluation.** Measure before-vs-after on a representative sample.

## Connecting to GPA

[[agent-gpa|Agent GPA]] tells you *which layer* failed — goal, plan, or action. Self-improvement targets the fix at that layer. The combination is a closed loop: evaluate → localize → update → re-evaluate.

## Related

- [[agent-gpa|Agent GPA]]
- [[agents/memory-management|Three Layers of Agent Memory]]
