# Knowledge Hub — Claude Context

## What This Is

A personal public ML/AI knowledge hub hosted at https://thakur-ro.github.io.
Organized by concept, not by source. Content is sanitized — no internal Workday/payroll specifics.

Built with [Quartz v4](https://quartz.jzhao.xyz/). Deploys automatically to GitHub Pages on every push to `main`.

## Owner

Rohit Thakur — ML/AI engineer at Workday, building a payroll agent.
GitHub: https://github.com/thakur-ro

## Content Structure

```
content/
├── retrieval/        RAG, hybrid search, GraphRAG, BM25
├── agents/           Harness engineering, memory, agentic loops, multi-agent
├── evaluation/       Agent GPA, self-improving agents
├── llm-internals/    Decision boundaries, user models/bias, linear probes
├── memory/           LLM Wiki Pattern, context compression
├── knowledge-graphs/ Context graphs + HDC, entity resolution
├── tooling/          MCP server design, FastMCP 3.0
├── governance/       AI Blueprint, operating models, CoE
└── nlp/              Topic modeling at scale (BERTopic + FAISS hybrid)
```

30 notes currently. Each folder has an `index.md` as the section landing page.

## Writing Style

Notes should read like Anthropic's technical blog posts:
- Open with a compelling framing or tension, not a definition
- Concrete example before the abstraction
- Every section earns its place — no padding
- References woven in, not bolted on at the end
- Short paragraphs, active voice

## Workflow: Adding New Content

1. Create `content/<concept>/note-name.md` with frontmatter:
   ```yaml
   ---
   title: "Note Title"
   tags: [tag1, tag2]
   date: YYYY-MM-DD
   ---
   ```
2. Use `[[note-name]]` for internal links (Quartz resolves shortest path)
3. `git add content/ && git commit -m "..." && git push origin main`
4. GitHub Actions builds and deploys automatically (~2 min)

## Workflow: Polish Existing Content

Use the `/polish-note` skill (to be built) to rewrite a note to Anthropic blog standard.

## GitHub Actions

`.github/workflows/deploy.yml` — builds with `npx quartz build`, deploys to GitHub Pages via `actions/deploy-pages`. Triggered on push to `main`.

**One-time setup required:** Go to repo Settings → Pages → set Source to **GitHub Actions**.

## Source Material

Notes in this hub are sanitized versions of:
- ODSC East 2026 session notes (full versions in `~/repos/personal-projects/odsc-east-2026/`)
- Internal Confluence pages (topic modeling, etc.)

The ODSC project is the source of truth for raw/detailed notes. This hub is the public-facing distillation.

## Quartz Config

Key settings in `quartz.config.ts`:
- `baseUrl`: `thakur-ro.github.io`
- `pageTitle`: `Rohit Thakur`
- `pageTitleSuffix`: ` | ML/AI Notes`
- Theme: Inter font, warm terracotta accent (`#cc785c`), clean minimal palette
