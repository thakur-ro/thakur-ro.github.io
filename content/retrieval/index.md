---
title: Retrieval & Search
---

# Retrieval & Search

How agents and systems find the right information at the right time. The difference between a useful answer and a hallucinated one often comes down to retrieval quality — not the model.

The key insight that runs through this section: **no single retrieval method is sufficient**. Dense vectors handle semantics but drift on exact terms. Sparse search nails keywords but misses meaning. Graphs capture relationships that neither can see. The right architecture layers all three.

## Notes

- [[hybrid-search|Hybrid Search: Dense + Sparse + RRF]] — Why vector search alone drifts, and how combining BM25 with dense retrieval via RRF fixes it
- [[graphrag|GraphRAG: When Vectors Aren't Enough]] — Adding citation graphs, ontology, and co-occurrence to retrieval pipelines
- [[rag-fundamentals|RAG Fundamentals]] — The baseline: grounding LLM answers in retrieved documents

## Subsections

- [[retrieval/knowledge-graphs/index|Knowledge Graphs]] — Graph-based context, HDC, entity resolution
- [[retrieval/classical-nlp/index|Classical NLP]] — Topic modeling at scale, BERTopic, FAISS
