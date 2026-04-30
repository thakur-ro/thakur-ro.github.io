---
title: "Agent GPA: Goal-Plan-Action Evaluation"
tags: [evaluation, agents, gpa, rubrics]
date: 2026-04-28
---

# Agent GPA: Goal-Plan-Action Evaluation

Most agent evaluation collapses a complex multi-step execution into a single pass/fail score. That tells you *whether* an agent failed but not *where*. GPA (Goal-Plan-Action) fixes this by factorizing evaluation across the three layers where failures actually occur.

## The Three Layers

**Goal** — Did the agent understand what it was trying to achieve? A goal failure means the agent solved the wrong problem, even if it executed perfectly.

**Plan** — Did the agent choose a good strategy? A plan failure means the goal was understood but the approach was wrong — wrong tool sequence, wrong decomposition, wrong assumptions.

**Action** — Did the agent execute correctly? An action failure means the plan was sound but individual steps were wrong — wrong API call, wrong parameter, incorrect output.

## Why Factorization Matters

When an agent fails, you need to know *which layer failed* to fix it:
- Goal failure → improve task specification and context
- Plan failure → improve reasoning prompts or add planning scaffolding
- Action failure → improve tool definitions or add validation

Fixing the wrong layer wastes time and can make things worse.

## By the Numbers

Measured on coding agent benchmarks:
- **95% error detection** — GPA catches nearly all failures
- **86% error localization** — correctly identifies which layer failed
- **+38% rubric consistency** — evolutionary rubric refinement makes evaluators agree with each other more

## Rubric Design

The evaluation uses rubrics — explicit criteria for what "good" looks like at each layer. Generic rubrics don't work; they need to be domain-specific.

**Evolutionary rubric refinement**: start with initial rubrics, run evaluations, identify disagreements between evaluators, update rubrics to resolve them. Repeat. The +38% consistency figure came from this process — rubrics are not fixed artifacts, they improve with iteration.

## The Self-Improvement Loop

```
Run evaluation (GPA scores)
       │
       ▼
Identify failure layer
       │
       ▼
Targeted fix (specification / planning / execution)
       │
       ▼
Refine rubrics where evaluators disagreed
       │
       ▼
Re-evaluate → loop
```

The agent improves and the evaluation system improves together.

## Related

- [[self-improving-agents|Self-Improving Agents]]
- [[agents/harness-engineering|Harness Engineering]]
- [[agents/agentic-loops|Agentic Loops]]
