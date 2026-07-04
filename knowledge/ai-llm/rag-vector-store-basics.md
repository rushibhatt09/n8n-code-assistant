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

## Common mistake

Using the same Vector Store node instance for both inserting and retrieving without noticing the "mode" setting is different — insert and retrieve are separate operations, and running "Insert" mode repeatedly on every workflow execution will keep duplicating the same documents. Also, forgetting that the Embeddings node used for retrieval must match the one used when the documents were inserted.
