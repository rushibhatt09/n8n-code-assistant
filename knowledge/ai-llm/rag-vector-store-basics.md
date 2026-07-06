---
title: RAG and Vector Store Basics
category: ai-llm
tags: [rag, vector-store, pinecone, supabase, retrieval]
summary: Explains Retrieval-Augmented Generation and how Vector Store nodes let an AI answer questions from your own documents.
---

**Retrieval-Augmented Generation (RAG)** means the AI looks up relevant chunks of your own documents before answering, instead of relying only on what it was trained on. This is how you get an AI to accurately answer questions about your company's policies, product manuals, or FAQs. n8n supports this through **Vector Store** nodes — options include **Pinecone Vector Store**, **Supabase Vector Store**, and a built-in **Simple Vector Store (In-Memory)** for quick tests.

Use RAG when you need the AI to answer from specific, private, or frequently-updated content that a general model wouldn't know (like your internal SOPs). Skip it for general knowledge questions or single-document Q&A that fits directly in a prompt.

## Setup steps

1. Prepare your documents first using a **Document Loader** and **Text Splitter** (see the "Document Loaders" topic).
2. Add an **Embeddings OpenAI** (or similar) node to convert text chunks into vectors.
3. Add a **Vector Store** node — pick **In-Memory Vector Store** for testing or **Pinecone/Supabase Vector Store** for production — set to "Insert" mode, and connect your embeddings and documents to load data in.
4. Run that insert workflow once to populate the store.
5. Add a second Vector Store node set to "Retrieve" mode (or "Retrieve as Tool" mode), pointing at the same index/table.
6. Connect it as a **Tool** input on your **AI Agent** node, or as a retriever feeding a Basic LLM Chain.
7. Ask a question in chat that should be answered from your documents, and confirm the answer cites the right content.

```json
{
  "parameters": {
    "mode": "retrieve-as-tool",
    "toolName": "company_handbook_search",
    "toolDescription": "Search the Dermatouch employee handbook for policy answers.",
    "topK": 4
  },
  "type": "@n8n/n8n-nodes-langchain.vectorStoreInMemory",
  "typeVersion": 1.1
}
```

## Ready-to-paste example

This workflow has two parts in one canvas: the top row loads, splits, embeds, and inserts handbook text into an In-Memory Vector Store; the bottom row wires a second Vector Store node (in "Retrieve as Tool" mode) into an AI Agent so it can search that same store when answering chat questions.

```json
{
  "name": "Handbook RAG - Insert And Query",
  "nodes": [
    {
      "parameters": {},
      "id": "a1b2c3d4-0210-4890-abcd-ef1234567890",
      "name": "Manual Trigger (Insert)",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [220, 220]
    },
    {
      "parameters": {
        "mode": "insert",
        "memoryKey": "dermatouch_handbook"
      },
      "id": "b2c3d4e5-0221-4901-bcde-f12345678901",
      "name": "Vector Store (Insert)",
      "type": "@n8n/n8n-nodes-langchain.vectorStoreInMemory",
      "typeVersion": 1.1,
      "position": [440, 220]
    },
    {
      "parameters": {
        "model": "text-embedding-3-small"
      },
      "id": "c3d4e5f6-0232-4012-cdef-123456789012",
      "name": "Embeddings OpenAI (Insert)",
      "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
      "typeVersion": 1.2,
      "position": [340, 420],
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
      "id": "d4e5f6a7-0243-4123-def0-234567890123",
      "name": "Default Data Loader",
      "type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
      "typeVersion": 1,
      "position": [560, 420]
    },
    {
      "parameters": {
        "chunkSize": 800,
        "chunkOverlap": 100
      },
      "id": "e5f6a7b8-0254-4234-ef01-345678901234",
      "name": "Recursive Character Text Splitter",
      "type": "@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter",
      "typeVersion": 1,
      "position": [560, 600]
    },
    {
      "parameters": {},
      "id": "f6a7b8c9-0265-4345-f012-456789012345",
      "name": "When chat message received",
      "type": "@n8n/n8n-nodes-langchain.chatTrigger",
      "typeVersion": 1.1,
      "position": [220, 820]
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.chatInput }}",
        "options": {
          "systemMessage": "You are a support assistant. Use the handbook search tool to answer policy questions accurately."
        }
      },
      "id": "a7b8c9d0-0276-4456-0123-567890123456",
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [440, 820]
    },
    {
      "parameters": {
        "model": "gpt-4o-mini",
        "options": {
          "temperature": 0.3
        }
      },
      "id": "b8c9d0e1-0287-4567-1234-678901234567",
      "name": "OpenAI Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.2,
      "position": [340, 1020],
      "credentials": {
        "openAiApi": {
          "id": "1",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "mode": "retrieve-as-tool",
        "toolName": "company_handbook_search",
        "toolDescription": "Search the Dermatouch employee handbook for policy answers.",
        "topK": 4
      },
      "id": "c9d0e1f2-0298-4678-2345-789012345678",
      "name": "Vector Store (Retrieve As Tool)",
      "type": "@n8n/n8n-nodes-langchain.vectorStoreInMemory",
      "typeVersion": 1.1,
      "position": [560, 1020]
    },
    {
      "parameters": {
        "model": "text-embedding-3-small"
      },
      "id": "d0e1f2a3-0309-4789-3456-890123456789",
      "name": "Embeddings OpenAI (Retrieve)",
      "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
      "typeVersion": 1.2,
      "position": [660, 1200],
      "credentials": {
        "openAiApi": {
          "id": "2",
          "name": "Company OpenAI Key"
        }
      }
    }
  ],
  "connections": {
    "Manual Trigger (Insert)": {
      "main": [[{ "node": "Vector Store (Insert)", "type": "main", "index": 0 }]]
    },
    "Embeddings OpenAI (Insert)": {
      "ai_embedding": [[{ "node": "Vector Store (Insert)", "type": "ai_embedding", "index": 0 }]]
    },
    "Default Data Loader": {
      "ai_document": [[{ "node": "Vector Store (Insert)", "type": "ai_document", "index": 0 }]]
    },
    "Recursive Character Text Splitter": {
      "ai_textSplitter": [[{ "node": "Default Data Loader", "type": "ai_textSplitter", "index": 0 }]]
    },
    "When chat message received": {
      "main": [[{ "node": "AI Agent", "type": "main", "index": 0 }]]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [[{ "node": "AI Agent", "type": "ai_languageModel", "index": 0 }]]
    },
    "Vector Store (Retrieve As Tool)": {
      "ai_tool": [[{ "node": "AI Agent", "type": "ai_tool", "index": 0 }]]
    },
    "Embeddings OpenAI (Retrieve)": {
      "ai_embedding": [[{ "node": "Vector Store (Retrieve As Tool)", "type": "ai_embedding", "index": 0 }]]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

## Common mistake

Using the same Vector Store node instance for both inserting and retrieving without noticing the "mode" setting is different — insert and retrieve are separate operations, and running "Insert" mode repeatedly on every workflow execution will keep duplicating the same documents. Also, forgetting that the Embeddings node used for retrieval must match the one used when the documents were inserted.
