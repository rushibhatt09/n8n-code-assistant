---
title: Document Loaders and Text Splitters
category: ai-llm
tags: [document-loader, text-splitter, pdf, chunking]
summary: How to load files like PDFs and split them into small chunks before turning them into embeddings.
---

Before you can search your own documents with AI, you need to get the text out of them (a PDF, a Word doc, plain text) and break it into small, manageable pieces. n8n's **Document Loader** nodes (such as **Default Data Loader** with a **PDF** binary input, or plain text loading) handle extracting the text, and a **Text Splitter** node (like **Recursive Character Text Splitter**) breaks that text into chunks sized right for embeddings.

## Setup steps

1. Get your file into the workflow first — e.g. via a **Read Binary File** node, an HTTP download, or a file upload trigger.
2. Add a **Default Data Loader** node and set its **Type of Data** to match your source (e.g. "Binary" for PDFs, "JSON" or plain text for other content).
3. Connect a **Recursive Character Text Splitter** node to the Data Loader's **Text Splitter** input.
4. Set **Chunk Size** (commonly 500–1000 characters) and **Chunk Overlap** (commonly 50–100 characters) so context isn't lost between chunks.
5. Connect the Data Loader's output into your **Vector Store** node's Document input, alongside an **Embeddings** node.
6. Run the workflow and check the vector store for the expected number of chunk records.

```json
{
  "parameters": {
    "chunkSize": 800,
    "chunkOverlap": 100
  },
  "type": "@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter",
  "typeVersion": 1
}
```

## Ready-to-paste example

This workflow loads binary document data, splits it into chunks, embeds those chunks, and inserts them into an In-Memory Vector Store.

```json
{
  "name": "Load And Chunk Documents",
  "nodes": [
    {
      "parameters": {},
      "id": "a1b2c3d4-0088-4890-abcd-ef1234567890",
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
      "id": "b2c3d4e5-0099-4901-bcde-f12345678901",
      "name": "In-Memory Vector Store",
      "type": "@n8n/n8n-nodes-langchain.vectorStoreInMemory",
      "typeVersion": 1.1,
      "position": [440, 300]
    },
    {
      "parameters": {
        "model": "text-embedding-3-small"
      },
      "id": "c3d4e5f6-00aa-4012-cdef-123456789012",
      "name": "Embeddings OpenAI",
      "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
      "typeVersion": 1.2,
      "position": [300, 500],
      "credentials": {
        "openAiApi": {
          "id": "2",
          "name": "Company OpenAI Key"
        }
      }
    },
    {
      "parameters": {
        "dataType": "binary",
        "options": {}
      },
      "id": "d4e5f6a7-00bb-4123-def0-234567890123",
      "name": "Default Data Loader",
      "type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
      "typeVersion": 1,
      "position": [560, 500]
    },
    {
      "parameters": {
        "chunkSize": 800,
        "chunkOverlap": 100
      },
      "id": "e5f6a7b8-00cc-4234-ef01-345678901234",
      "name": "Recursive Character Text Splitter",
      "type": "@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter",
      "typeVersion": 1,
      "position": [560, 680]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{ "node": "In-Memory Vector Store", "type": "main", "index": 0 }]]
    },
    "Embeddings OpenAI": {
      "ai_embedding": [[{ "node": "In-Memory Vector Store", "type": "ai_embedding", "index": 0 }]]
    },
    "Default Data Loader": {
      "ai_document": [[{ "node": "In-Memory Vector Store", "type": "ai_document", "index": 0 }]]
    },
    "Recursive Character Text Splitter": {
      "ai_textSplitter": [[{ "node": "Default Data Loader", "type": "ai_textSplitter", "index": 0 }]]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

## Common mistake

Setting chunk size too large (e.g. 5000+ characters) thinking "more context is better" — oversized chunks dilute the embedding's ability to match specific questions and can blow past the model's context limit when several chunks are retrieved together. Start around 500–1000 characters with some overlap, and adjust based on how well retrieval performs in testing.
