---
title: Embeddings Nodes
category: ai-llm
tags: [embeddings, openai-embeddings, vectors, chunking]
summary: Explains what embeddings are and how to use the Embeddings OpenAI node to turn text into searchable vectors.
---

An "embedding" is a way of converting a chunk of text into a list of numbers (a vector) that captures its meaning, so a computer can compare how similar two pieces of text are — even if they use different words. Embeddings are the foundation of RAG and semantic search: n8n's **Embeddings OpenAI** node (and similar ones like Embeddings Cohere or Embeddings Google Gemini) does this conversion for you before text goes into a Vector Store.

You don't call an Embeddings node on its own — it's always plugged into a Vector Store node's Embeddings input, both when saving documents and when searching them.

## Setup steps

1. Add an **Embeddings OpenAI** node.
2. Set up its credential with your OpenAI API key (same as for Chat Model nodes).
3. Pick a model, typically `text-embedding-3-small` (cheaper, good for most cases) or `text-embedding-3-large` (more accurate, costlier).
4. Connect this node to the **Embeddings** input of your **Vector Store** node — both the "insert" version and the "retrieve" version.
5. Before embedding, split large documents into smaller chunks using a **Text Splitter** (see "Document Loaders") — embeddings work best on paragraph-sized chunks, not entire files.
6. Run your insert workflow and confirm the vector store shows records with numeric vectors, not raw errors.

```json
{
  "parameters": {
    "model": "text-embedding-3-small"
  },
  "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
  "typeVersion": 1.2,
  "credentials": {
    "openAiApi": {
      "id": "2",
      "name": "Company OpenAI Key"
    }
  }
}
```

## Common mistake

Switching embedding models (e.g. from `text-embedding-3-small` to `text-embedding-3-large`) after you've already saved data to a vector store — different models produce different vector formats/sizes, so searches will fail or return nonsense. If you change the embeddings model, re-insert all your documents from scratch with the new model.
