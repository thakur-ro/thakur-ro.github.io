---
title: RAG Fundamentals
tags: [retrieval, rag, llm]
date: 2026-04-29
---

# RAG Fundamentals

Retrieval-Augmented Generation grounds LLM answers in documents you control. The core loop: embed a query → find nearby documents → pass them as context → LLM answers from that context rather than from parametric memory.

## Why It Matters

LLMs hallucinate when asked about things not in their training data, or when they're uncertain. RAG replaces hallucinated parametric recall with retrieved facts. The answer is only as good as the retrieval.

## The Basic Pipeline

1. **Index time** — chunk documents, embed each chunk, store in a vector index
2. **Query time** — embed the query, retrieve nearest chunks, inject into prompt
3. **Generate** — LLM answers using retrieved context

## Failure Modes

- **Semantic drift** — dense-only retrieval misses exact terms → fix with [[hybrid-search|hybrid search]]
- **Missing lineage** — retrieval misses foundational documents → fix with [[graphrag|GraphRAG]]
- **Context overflow** — too many retrieved chunks crowd out the question → fix with reranking + compression
- **Chunking mismatch** — chunk boundaries break logical units → tune chunk size and overlap

## The Retrieval Stack (in order of complexity)

1. Dense-only (baseline)
2. Hybrid: dense + BM25 + RRF
3. Hybrid + reranker (cross-encoder)
4. GraphRAG (graph enrichment on top of hybrid)

Each layer solves the previous layer's failure mode.

## Related

- [[hybrid-search|Hybrid Search]]
- [[graphrag|GraphRAG]]
