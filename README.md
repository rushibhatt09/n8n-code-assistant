# n8n Code Assistant

A self-hosted site that helps **non-technical people** get exact, working answers for n8n: node configs, API integration steps, expressions, and AI/LLM/agent workflows.

Two ways to get help:
1. **Search** a growing knowledge base of n8n topics (nodes, integrations, AI features, troubleshooting).
2. **Ask AI** a question in plain English (e.g. "How do I send a Slack message when someone fills out a Google Form?") and get back exact steps + copy-pasteable code, grounded in the knowledge base.

Everything runs locally on your own computer. Nothing is uploaded anywhere except your own question text, and only if you've added an AI API key (see below).

---

## 1. Requirements

- [Node.js](https://nodejs.org/) version 18 or newer (check with `node -v`)
- (Optional, but recommended) An [Anthropic API key](https://console.anthropic.com/) — this powers the "Ask AI" box. Without it, search still works fully.

## 2. Setup (one time)

Open a terminal in this folder and run:

```bash
npm install
```

Then create your own `.env` file from the example:

```bash
cp .env.example .env
```

Open `.env` in any text editor and paste your API key:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

If you don't have a key yet, you can skip this — the search side of the site works without it.

## 3. Run it

```bash
npm start
```

Then open your browser to:

```
http://localhost:4477
```

That's it — the site is now running on your machine.

## 4. Using it day to day

- Type in the top **"Ask AI"** box for any n8n question in plain English.
- Use the **search bar** below it to browse by keyword, or click a category on the left (Nodes, Integrations, AI & LLM, Concepts, Troubleshooting).
- Click any result to read the full guide with copy-pasteable code.

## 5. Adding more knowledge

The knowledge base is just plain Markdown files under `knowledge/<category>/*.md`. Each file starts with a small header like this:

```markdown
---
title: Slack
category: integrations
tags: [slack, messaging, oauth]
summary: Send messages to Slack channels or DMs from a workflow.
---

Your guide content here, in normal Markdown, with code blocks.
```

Add a new `.md` file, restart the server (`npm start`), and it's searchable immediately — no coding required.

## 6. Sharing this on GitHub

This project is safe to publish publicly as-is:

- `.env` (which holds your private API key) is excluded via `.gitignore` and will never be committed.
- Anyone who clones the repo follows steps 1–3 above with **their own** API key.

To publish:

```bash
git init
git add .
git commit -m "Initial commit: n8n Code Assistant"
git branch -M main
git remote add origin https://github.com/<your-username>/n8n-code-assistant.git
git push -u origin main
```

## Project structure

```
n8n-code-assistant/
  server/            Express backend (search + AI proxy)
  public/            Frontend (plain HTML/CSS/JS, no build step)
  knowledge/          The knowledge base — Markdown files, organized by category
  .env.example       Template for your local API key config
```

## Troubleshooting

- **"Ask AI" says no API key configured** — add `ANTHROPIC_API_KEY` to your `.env` file and restart with `npm start`.
- **Port already in use** — change `PORT=4477` in `.env` to another number, e.g. `4488`.
- **New knowledge files aren't showing up** — restart the server, or call `POST http://localhost:4477/api/reload`.
