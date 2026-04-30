---
title: "Hybrid Search: Dense + Sparse + RRF"
tags: [retrieval, rag, search, vectors, bm25]
date: 2026-04-29
---

# Hybrid Search: Dense + Sparse + RRF

Vector search alone has a failure mode that's easy to miss: **semantic drift**. A query for "p53 mutations in glioblastoma" returns papers about p53 *or* about glioblastoma — semantically adjacent but not the intersection you wanted. The fix is hybrid search: run dense and sparse retrieval in parallel and fuse the results by rank.

## The Two Primitives

**Dense vectors** — an embedding model converts text to a fixed-length float vector (e.g. 1536-dim for `text-embedding-3-small`). Similar meanings end up geometrically close. Strength: handles synonyms, paraphrasing, semantic relationships. Weakness: dilutes exact terms in high-dimensional space.

**Sparse vectors (BM25)** — a vector with values only for the token IDs that appear in the document. BM25 scores by:
- **TF** — how often the term appears in this document
- **IDF** — how rare the term is across the whole corpus (rare = informative)
- **Length normalization** — so long documents don't get a free advantage

Strength: exact term precision — "FICA tip credit" or "§1673(a)" won't get diluted. Weakness: misses synonyms entirely.

**They cover each other's blind spots.** Dense handles meaning; sparse handles exactness. Run both.

## Reciprocal Rank Fusion (RRF)

You can't compare raw scores across retrievers — a cosine similarity of 0.72 and a BM25 score of 14.3 live on incomparable scales. RRF avoids this by working with **ranks**, not scores:

$$\text{RRF}(d) = \sum_{\text{retriever}} \frac{1}{k + \text{rank}(d)}$$

where $k = 60$ by default. Documents that rank well in *both* retrievers float to the top. Documents that rank well in only one get partial credit.

```python
# Qdrant hybrid query pattern
results = qdrant.query_points(
    collection_name=COLLECTION,
    prefetch=[
        models.Prefetch(query=dense_embedding, using="dense", limit=top_k * 3),
        models.Prefetch(
            query=models.SparseVector(indices=bm25_indices, values=bm25_values),
            using="bm25",
            limit=top_k * 3,
        ),
    ],
    query=models.FusionQuery(fusion=models.Fusion.RRF),
    limit=top_k,
)
```

The `prefetch` over-retrieves (3×) from each index independently, then RRF re-ranks the union.

## Collection Setup

Qdrant stores both vector types in a single collection:

```python
qdrant.create_collection(
    collection_name=COLLECTION,
    vectors_config={
        "dense": models.VectorParams(size=1536, distance=models.Distance.COSINE),
    },
    sparse_vectors_config={
        "bm25": models.SparseVectorParams(modifier=models.Modifier.IDF),
    },
)
```

The `IDF` modifier keeps corpus statistics server-side so you don't have to recompute them locally when new documents arrive.

## What Hybrid Still Can't Do

Hybrid retrieval treats every document as an isolated point in space. It cannot see:
- **Citations** — Paper A cites Paper B
- **Ontological relationships** — these two papers are about the same MeSH concept
- **Lineage** — every paper you retrieved builds on this foundational work

For that you need a graph layer. See [[graphrag|GraphRAG]].

## The Four-Stage Progression

| Stage | What breaks | What fixes it |
|-------|-------------|--------------|
| Vanilla LLM | Hallucinated citations | — |
| Vector RAG | Semantic drift on specific queries | Dense embeddings |
| Hybrid Search | Missing keyword precision | BM25 sparse + RRF |
| GraphRAG | Misses foundational / lineage papers | Citation + ontology graph |

## Related

- [[graphrag|GraphRAG: When Vectors Aren't Enough]]
- [[rag-fundamentals|RAG Fundamentals]]
- [[knowledge-graphs/context-graphs-hdc|Context Graphs and HDC]]
