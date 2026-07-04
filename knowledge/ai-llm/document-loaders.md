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

## Common mistake

Setting chunk size too large (e.g. 5000+ characters) thinking "more context is better" — oversized chunks dilute the embedding's ability to match specific questions and can blow past the model's context limit when several chunks are retrieved together. Start around 500–1000 characters with some overlap, and adjust based on how well retrieval performs in testing.
