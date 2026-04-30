---
title: The LLM Wiki Pattern
tags: [memory, agents, context, openclaw, knowledge-management]
date: 2026-04-28
---

# The LLM Wiki Pattern

Long-running agents accumulate context. Naive solutions — stuff everything into the prompt, or summarize everything aggressively — both fail. The LLM Wiki Pattern solves this with a three-tier memory architecture where each tier has a different mutability, cost, and purpose.

## Three Tiers

### Tier 1 — Raw Sources (append-only, never edited)

```
vault/          ← full conversation logs
daily_rollups/  ← last 24h summaries  
scratch/        ← session context
```

These files are append-only. Nothing is deleted or edited. This is your ground truth — if something was said, it's here.

### Tier 2 — Curated Summaries (size-bounded, promoted by dreaming)

```
SOUL.md     ← agent identity and values
AGENTS.md   ← agent registry
MEMORY.md   ← facts and learned behaviors  
DREAMS.md   ← hypotheses and reflections
```

These are small, bounded files. They don't grow unboundedly — they're rewritten when the dreaming process promotes new information. Each file has a size limit enforced by convention.

### Tier 3 — Generated Artifacts (one-shot, never re-read)

```
Responses, plans, code
```

These are outputs. The agent writes them; it doesn't re-read them. They're derived from Tier 1 + Tier 2, not stored back.

## The Dreaming Process

Dreaming is the promotion mechanism between Tier 1 and Tier 2:

```
Scan Tier 1 for new signal
       │
       ▼
Judge: promote or discard?
       │
       ├─ Signal is new and load-bearing → update Tier 2 file
       └─ Signal is ephemeral or redundant → discard
```

Dreaming runs asynchronously (offline, between sessions, or during idle periods). It's what keeps Tier 2 files from becoming stale — and from growing unboundedly.

## Why This Works

| Problem | Solution |
|---|---|
| Context window overflow | Tier 1 is never loaded in full; Tier 2 is small and curated |
| Knowledge loss | Tier 1 is append-only; nothing is permanently deleted |
| Stale summaries | Dreaming continuously refreshes Tier 2 from Tier 1 |
| Expensive re-reads | Tier 3 artifacts are never re-read — they're output, not memory |

## The Key Insight

**Generated content and stored memory are different things.** Most systems conflate them. The LLM Wiki Pattern separates them architecturally: Tier 3 artifacts are write-once outputs; Tier 2 files are curated, bounded memory. An agent that re-reads its own outputs is conflating the two — and it leads to circular reasoning, cost explosion, and context pollution.

## Related

- [[agents/memory-management|Three Layers of Agent Memory]]
- [[context-compression|Context Compression]]
