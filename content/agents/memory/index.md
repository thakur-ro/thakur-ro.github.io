---
title: Memory & State
---

# Memory & State

Agents fail from losing the thread, not from hitting the token limit. The fix isn't a bigger context window — it's a deliberate memory architecture: what goes in the prompt, what lives in files, and what gets promoted to durable skills.

## Notes

- [[llm-wiki-pattern|The LLM Wiki Pattern]] — A three-tier memory architecture: raw sources, curated summaries, generated artifacts
- [[context-compression|Context Compression and Compaction]] — When and how to reset, compact, or summarize the active context window
