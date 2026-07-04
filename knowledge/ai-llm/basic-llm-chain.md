---
title: Basic LLM Chain
category: ai-llm
tags: [llm-chain, prompt, simple-ai, langchain]
summary: A simple node that sends one prompt to an AI model and returns one text answer, no tools or memory needed.
---

The **Basic LLM Chain** node is the simplest way to use AI in n8n: you give it a prompt, it sends that prompt to a connected model, and it returns the generated text. Use it for straightforward tasks like summarizing a paragraph, rewriting text, classifying a message, or generating a reply — anything that doesn't need tools, multi-step reasoning, or memory.

## Setup steps

1. Add a **Basic LLM Chain** node to your workflow.
2. Connect a model node to its **Chat Model** input, such as **OpenAI Chat Model** or **Anthropic Chat Model**.
3. In the node's **Prompt** field, type your instructions or map data from a previous node, e.g. `{{ $json.customerMessage }}`.
4. Optionally add a **System Message** in the node's options to set tone/role (e.g. "You are a concise email assistant").
5. Optionally connect a **Structured Output Parser** if you need the reply back as JSON instead of plain text.
6. Run the node once with test data to confirm the output looks right before connecting downstream nodes.

```json
{
  "parameters": {
    "promptType": "define",
    "text": "=Summarize this customer message in one sentence: {{ $json.customerMessage }}",
    "options": {
      "systemMessage": "You are a helpful assistant that writes short, clear summaries."
    }
  },
  "type": "@n8n/n8n-nodes-langchain.chainLlm",
  "typeVersion": 1.5
}
```

## Common mistake

Using Basic LLM Chain when you actually need tools or memory — it has no way to call external APIs or remember previous messages. If your task requires the AI to look something up, take an action, or hold a conversation across multiple turns, switch to the **AI Agent** node instead.
