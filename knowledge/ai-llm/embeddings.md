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

## Ready-to-paste example

This workflow embeds a piece of text with Embeddings OpenAI and inserts it into an In-Memory Vector Store for later searching.

```json
{
  "name": "Insert Text Into Vector Store",
  "nodes": [
    {
      "parameters": {},
      "id": "a1b2c3d4-0055-4890-abcd-ef1234567890",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [220, 300]
    },
    {
      "parameters": {
        "mode": "insert",
        "memoryKey": "dermatouch_docs"
      },
      "id": "b2c3d4e5-0066-4901-bcde-f12345678901",
      "name": "In-Memory Vector Store",
      "type": "@n8n/n8n-nodes-langchain.vectorStoreInMemory",
      "typeVersion": 1.1,
      "position": [440, 300]
    },
    {
      "parameters": {
        "model": "text-embedding-3-small"
      },
      "id": "c3d4e5f6-0077-4012-cdef-123456789012",
      "name": "Embeddings OpenAI",
      "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
      "typeVersion": 1.2,
      "position": [440, 500],
      "credentials": {
        "openAiApi": {
          "id": "2",
          "name": "Company OpenAI Key"
        }
      }
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{ "node": "In-Memory Vector Store", "type": "main", "index": 0 }]]
    },
    "Embeddings OpenAI": {
      "ai_embedding": [[{ "node": "In-Memory Vector Store", "type": "ai_embedding", "index": 0 }]]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

## Common mistake

Switching embedding models (e.g. from `text-embedding-3-small` to `text-embedding-3-large`) after you've already saved data to a vector store — different models produce different vector formats/sizes, so searches will fail or return nonsense. If you change the embeddings model, re-insert all your documents from scratch with the new model.
