---
title: Context Graphs and Hyperdimensional Computing
tags: [knowledge-graphs, hdc, context-engineering, retrieval]
date: 2026-04-28
---

# Context Graphs and Hyperdimensional Computing

Standard vector retrieval finds documents similar to your query. Context graphs find documents *relevant* to your reasoning — a distinction that matters when the information you need is two hops away from the query's embedding neighborhood.

## Two Retrieval Primitives

**Discrete (graph-based)** — explicit nodes and edges. Exact traversal. Cypher or SPARQL. "Find all regulations that depend on this rule." Fast and precise for known relationship types.

**Associative (HDC-based)** — holographic patterns in high-dimensional space (10k+ dimensions). Approximate, noise-tolerant. "Find concepts that tend to co-occur with this one." Handles ambiguity and partial matches that break graph queries.

Neither is sufficient alone. A hybrid retriever runs both and combines their outputs.

## Hyperdimensional Computing Basics

HDC encodes information as dense vectors with 10,000+ dimensions, where:
- **Similar concepts** have vectors with high cosine similarity
- **Dissimilar concepts** have nearly orthogonal vectors
- **Composed concepts** are created by binding operations

The key operation for knowledge graphs: **BIND(Subject, Predicate, Object)** — combines three concept vectors into a single holographic vector that encodes the entire triple. You can query it associatively: given (Subject, Predicate, ?), recover the Object by algebraic inversion.

This means a knowledge graph edge isn't just a pointer — it's a mathematical relationship encoded in a vector that supports approximate retrieval.

## Why 10,000 Dimensions

At 10k+ dimensions, random vectors are nearly orthogonal with very high probability. This means:
- You can superimpose thousands of fact-triples into a single memory vector
- Individual facts can still be retrieved by similarity search
- Noise tolerance improves as dimensionality increases

Lower-dimensional embeddings (768, 1536) don't have this property — they get saturated quickly when you try to compose multiple concepts.

## Hybrid Retrieval Pattern

```
Query
  │
  ├─→ [Discrete path] Graph traversal (Cypher/SPARQL)
  │         exact structural matches
  │
  └─→ [Associative path] HDC similarity search
            approximate/semantic matches
  │
  ▼
Combine and rank results
  │
  ▼
Grounded context → LLM
```

The discrete path handles "what depends on regulation X?" The associative path handles "what concepts are related to this query?" Together they cover the retrieval space that either alone misses.

## Related

- [[entity-resolution|Entity-Centric Learning and Resolution]]
- [[retrieval/graphrag|GraphRAG]]
- [[retrieval/hybrid-search|Hybrid Search]]
