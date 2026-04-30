---
title: Entity-Centric Learning and Resolution
tags: [knowledge-graphs, entity-resolution, matching, data-quality]
date: 2026-04-28
---

# Entity-Centric Learning and Resolution

Traditional entity matching compares records pairwise: is Record A the same person as Record B? Entity-centric learning asks a different question: given everything I know about this real-world entity, what is the best unified representation?

The distinction matters at scale. Pairwise matching misses patterns that are only visible when you consider all records for an entity simultaneously.

## Three Capabilities

**Entity-centric matching** — instead of comparing Record A to Record B, build an entity from all records that might refer to the same real-world thing, then evaluate the entity holistically. Patterns that look ambiguous pairwise become clear when all evidence is combined.

**Ambiguous condition handling** — near-duplicate detection and disambiguation. Pairwise matchers either merge or don't; entity-centric systems can represent uncertainty and flag records that are genuinely ambiguous for human review.

**Real-time self-correction** — when a new record arrives and changes the balance of evidence for an entity, the system re-evaluates the entity immediately. No batch reprocessing required. The entity's representation updates as its contributing records change.

## Why Pairwise Matching Fails at Scale

Imagine three records: A matches B (80% confidence), B matches C (80% confidence), but A doesn't directly match C. A pairwise system either chains them or not based on thresholds. An entity-centric system looks at A + B + C together, finds the inconsistency, and can either resolve it or surface it for review.

The 80/80 example is a real failure mode in production systems — chains of pairwise matches create entities that don't actually represent a single real-world thing.

## Self-Correction in Practice

Traditional pipelines run entity resolution as a batch step. If a new record arrives that changes an entity — a name change, an address correction, a new identifier — the entity doesn't update until the next batch run.

Real-time self-correction means:
- New record arrives → affected entities immediately re-evaluated
- Entity merges and splits happen continuously, not nightly
- Downstream systems see the current best entity, not yesterday's batch result

## Related

- [[context-graphs-hdc|Context Graphs and HDC]]
- [[retrieval/graphrag|GraphRAG]]
