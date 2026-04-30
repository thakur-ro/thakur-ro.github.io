---
title: Topic Modeling at Scale
tags: [nlp, topic-modeling, bertopic, clustering, llm, faiss]
date: 2025-12-31
---

# Topic Modeling at Scale

Standard evaluation frameworks for AI systems focus on accuracy — did the agent answer correctly? But when you're trying to understand what a deployed system is actually doing across thousands of real conversations, accuracy numbers are the wrong starting point. You need a way to discover the structure of the problem space first.

This is what topic modeling at scale solves: **turning a large corpus of unstructured text into a structured map of what's happening.**

## The Problem

Two categories of signal are worth extracting from production conversations:

1. **User intent** — what are users actually asking for? (Not what you assumed they'd ask for.)
2. **Error patterns** — where does the system fail, and in what recurring ways?

The naive approach — classify each conversation with an LLM — works at small scale. At large scale it breaks down in two ways: cost grows linearly with dataset size, and the LLM increasingly invents category labels rather than converging on a stable taxonomy.

## Direct LLM Classification (and Why It Doesn't Scale)

The direct approach: give an LLM each conversation, a list of known categories, and ask it to assign a label.

```python
def classify_conversation(conversation: str, llm) -> dict:
    prompt = f"""
    Analyze this conversation. 
    Assign a TOPIC from {TOPIC_CATEGORIES} or propose a new one.
    Assign an ERROR_CATEGORY from {ERROR_CATEGORIES}.
    Respond in JSON only.
    CONVERSATION: {conversation}
    """
    return llm.invoke(prompt)
```

**Results:** Good output quality. Reasonable category discovery.

**Problem:** For ~200 documents, runtime was ~30 minutes locally. API costs scale as O(N) — every new conversation is a new LLM call. At 10,000 conversations you're looking at hours and significant cost. At 100,000 you're looking at days.

A second problem emerges at scale: the LLM doesn't see the whole corpus at once, so its labels drift. Early conversations get label "Minimum Wage Inquiry"; later ones get "Wage Floor Question." Semantically identical; taxonomically distinct.

## The Hybrid Approach: Cluster First, Label Once

The insight: **LLM calls are expensive; math is cheap.** Use clustering to group similar conversations, then ask the LLM to label each cluster by looking at representative samples. Instead of N LLM calls, you need roughly n calls, where n is the number of clusters and n << N.

```
N conversations → embed → cluster → n clusters
                                         │
                              sample centroids
                                         │
                              LLM labels each cluster
                                         │
                              apply labels back to all N
```

API calls go from O(N) to O(n). At 200 conversations with 13 clusters, that's a 15× reduction. The ratio improves as the dataset grows.

## Implementation

### 1. Preprocessing

Separate the corpus into signal-bearing units before embedding:
- **User intent corpus**: human turns only
- **Error corpus**: AI response turns only

Mixed transcripts dilute both signals. User intent is most visible in human turns; failure patterns are most visible in AI turns.

Apply light noise removal: drop very short messages (under ~5 tokens), remove special characters that don't carry semantic meaning.

### 2. Embed with a Sentence Transformer

Convert each message to a dense vector using a pre-trained sentence transformer. The embedding model's quality determines the quality of the clusters — mushy embeddings produce mushy clusters.

Dimension: 768 for most sentence transformers (e.g., `all-mpnet-base-v2`).

### 3. Store and Retrieve with FAISS

[FAISS](https://github.com/facebookresearch/faiss) (Facebook AI Similarity Search) provides fast approximate nearest-neighbor search over large embedding sets. It's the right tool for this step — faster than a full vector database for offline batch work, and well-supported via LangChain.

```python
from langchain_community.vectorstores import FAISS

vectorstore = FAISS.from_documents(documents, embedding_model)
# Retrieve N most similar documents to a centroid
similar_docs = vectorstore.similarity_search_by_vector(centroid, k=N)
```

The FAISS layer serves two purposes: clustering (finding similar documents) and centroid sampling (finding the most representative examples from each cluster to send to the LLM).

### 4. Cluster with BERTopic

[BERTopic](https://maartengr.github.io/BERTopic/) wraps UMAP (dimensionality reduction) + HDBSCAN (density clustering) with topic representation layers. It handles the full pipeline from embeddings to labeled topics.

**Zero-shot topic assignment as a front door:**

BERTopic supports providing a list of expected topics upfront. Documents that strongly match a known topic are assigned directly; remaining documents are clustered to discover new ones. This gives you:
- Control over obvious/expected categories
- Discovery of categories you didn't anticipate

Practical note from running this: **overlapping zero-shot categories cause problems.** If two categories pull in the same documents, the assignment becomes unstable. Keep categories mutually exclusive; iterate on the list.

**Prompt constraint that matters:** `3–5 words, label only, no explanation.` Without this hard constraint, LLM-generated labels become paragraphs. Labels that are too long break downstream aggregation.

### 5. LLM Labeling with Continuous Memory

The LLM sees representative samples from each cluster (documents nearest to the centroid) and assigns a topic and error label. The key detail: the LLM needs **continuous memory of labels it has already assigned**.

```python
assigned_labels = {}  # grows as LLM labels each cluster

for cluster in clusters:
    samples = get_centroid_samples(cluster, vectorstore)
    label = llm.label(
        samples=samples,
        existing_labels=assigned_labels,  # context window includes all prior labels
        zero_shot_categories=KNOWN_CATEGORIES,
    )
    assigned_labels[cluster.id] = label
```

Without this memory, the LLM invents near-duplicate labels for similar clusters. With it, it reuses existing labels when appropriate and only proposes new ones when the cluster is genuinely novel.

### 6. Join Back and Validate

Attach the cluster labels back to the original documents. Then sample rows from each topic bucket and ask: does this label make sense for this document? This is the most important quality check — you want human agreement with the assignments before using them.

## Complexity Comparison

| | Direct LLM | Hybrid |
|---|---|---|
| API calls | O(N) — one per conversation | O(n) — one per cluster |
| Compute | O(N·K²) — full text per call | O(N·K) embedding + O(N log N) clustering |
| Bottleneck | API latency + cost | Local compute (embedding) |
| Label consistency | Drifts as N grows | Stable (single LLM pass per cluster) |

At 200 conversations with 13 clusters: 15× fewer API calls, ~30× faster wall-clock time.

## Evaluating Quality (Without a Ground Truth Label Set)

This is unsupervised — there's no ground truth to compare against. Useful checks:

- **Outlier ratio** — high values mean clustering is too strict or the text is too noisy
- **Topic diversity** — if top words overlap heavily across clusters, boundaries aren't distinct
- **Silhouette score** (excluding outliers) — sanity check for cluster separation
- **Topic size distribution** — flags overly broad buckets that are catching too much
- **Auditability** — sample 5 rows from each bucket; can you agree the label fits?

The auditability check is the most important. Numeric metrics can look fine while the labels are semantically off.

## Failure Modes

- **Prompt regression** — if the LLM starts returning explanations instead of short labels, all downstream aggregation breaks. Enforce the constraint hard.
- **Embedding sensitivity** — the clustering is only as good as the embedding model. Test with domain-specific models if general sentence transformers produce poor separation.
- **Category definition bias** — if one error category dominates, improve its description and add negative examples before adding new categories.
- **Preprocessing drops** — always log how many documents were dropped at each preprocessing step and why. Unexpected drops indicate data quality issues upstream.

## References

- [BERTopic documentation](https://maartengr.github.io/BERTopic/)
- [BERTopic zero-shot topics](https://maartengr.github.io/BERTopic/getting_started/zeroshot/zeroshot.html)
- [BERTopic best practices](https://maartengr.github.io/BERTopic/getting_started/best_practices/best_practices.html)
- [FAISS (Facebook Research)](https://github.com/facebookresearch/faiss)
- [Sentence Transformers](https://www.sbert.net/)

## Related

- [[retrieval/hybrid-search|Hybrid Search]]
- [[retrieval/rag-fundamentals|RAG Fundamentals]]
