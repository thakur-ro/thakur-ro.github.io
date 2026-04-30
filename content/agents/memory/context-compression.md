---
title: Context Compression and Compaction
tags: [memory, context, compression, agents]
date: 2026-04-28
---

# Context Compression and Compaction

Context windows are finite and expensive. As a conversation or agent run grows, older content degrades in influence (recency bias in attention) and costs more to process. Compression is the practice of deliberately managing what stays in the window and in what form.

## Three Approaches

**Reset** — discard the current context entirely and rebuild from scratch. Refill with original instructions + critical artifacts only. Aggressive but sometimes the cleanest option when context has become incoherent.

**Compaction (summarize and compress)** — summarize older turns into a compact representation, keep recent turns intact. The Anthropic compaction technique: as the window approaches capacity, summarize the earliest N turns into a single paragraph and remove the originals.

**Rewind** — roll back to a known-good checkpoint. Useful when the agent has entered a bad state and summarization would just compress the bad state.

## The Cost of Verbosity

Tool traces are the primary source of context pollution. A single bash command that returns 300 lines of warnings consumes thousands of tokens and pushes the actual goal backward. **Verbose tool output is the #1 way agents lose the thread.**

Design principles for tool output:
- Return the minimum needed for the agent to make a decision
- Structured data over prose
- Errors should be specific (what failed, where, what to do next) not verbose (stack traces by default)

## Files as External Context

The alternative to compression is externalization: write intermediate state to files instead of accumulating it in the prompt. Plans, TODOs, intermediate results — all of these can live on disk and be loaded selectively, rather than sitting permanently in the context window.

See [[agents/memory-management|Three Layers of Agent Memory]] for the full pattern.

## Related

- [[llm-wiki-pattern|The LLM Wiki Pattern]]
- [[agents/memory-management|Three Layers of Agent Memory]]
- [[agents/harness-engineering|Harness Engineering]]
