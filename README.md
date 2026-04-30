# ML/AI Knowledge Hub

Personal notes on ML systems, AI engineering, and applied research — organized by concept, not by source.

**[→ View the site](https://thakur-ro.github.io)**

---

## What's here

```
content/
├── retrieval/        RAG, hybrid search, GraphRAG, BM25
├── agents/           Harness engineering, memory, agentic loops
├── evaluation/       Agent GPA, self-improving agents
├── llm-internals/    Decision boundaries, user models, bias
├── memory/           Context management, LLM Wiki Pattern
├── knowledge-graphs/ Context graphs, HDC, entity resolution
├── tooling/          MCP servers, FastMCP
├── governance/       AI blueprints, operating models
└── nlp/              Topic modeling at scale
```

## Adding a note

Drop a markdown file in the relevant concept folder with frontmatter:

```yaml
---
title: "Note Title"
tags: [tag1, tag2]
date: YYYY-MM-DD
---
```

Internal links use `[[note-name]]` syntax. The site rebuilds automatically on push to `main`.

## Built with

[Quartz v4](https://quartz.jzhao.xyz/) — static site generator for digital gardens.
