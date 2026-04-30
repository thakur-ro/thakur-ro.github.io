---
title: NLP at Scale
---

# NLP at Scale

LLMs didn't replace classical NLP — they made it more useful. Clustering still beats asking an LLM to invent categories from scratch. Embeddings + FAISS still beat prompting your way through 10,000 documents one at a time. The hybrid wins.

## Notes

- [[topic-modeling-at-scale|Topic Modeling at Scale]] — Cluster first with BERTopic + FAISS, then use LLMs to label clusters — O(n) API calls instead of O(N)
