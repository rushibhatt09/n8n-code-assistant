---
title: AI Agent Node
category: ai-llm
tags: [ai-agent, tools, memory, langchain]
summary: Connects a language model, tools, and memory so n8n can reason through multi-step tasks on its own.
---

The **AI Agent** node is n8n's "thinking" node. Instead of just sending one prompt and getting one answer, it can decide to call tools (like a search API or your database), look at the results, and decide what to do next — looping until it has a final answer. Use it when a task needs judgment or multiple steps, not just a single text reply.

## Setup steps

1. Drag an **AI Agent** node onto your canvas.
2. Connect a model to its **Chat Model** input — usually **OpenAI Chat Model** or **Anthropic Chat Model**.
3. (Optional but common) Connect one or more tools to the **Tool** input, such as **HTTP Request Tool**, **Code Tool**, or a **Vector Store** tool for document lookup.
4. (Optional) Connect **Window Buffer Memory** to the **Memory** input so it remembers earlier messages in the conversation.
5. In the AI Agent node's main panel, set the **Prompt (User Message)** field, often mapped from an incoming chat trigger like `{{ $json.chatInput }}`.
6. Write a clear **System Message** describing the agent's role and boundaries.
7. Test with the built-in chat panel before wiring it into a full workflow.

```json
{
  "parameters": {
    "promptType": "define",
    "text": "={{ $json.chatInput }}",
    "options": {
      "systemMessage": "You are a support assistant for Dermatouch. Answer using the tools provided. If you don't know, say so."
    }
  },
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 1.7
}
```

## Common mistake

Forgetting to attach a **Chat Model** node — the AI Agent node cannot run without one connected to its Model input, and n8n will show a red error on the node until you do. Also, adding too many tools with vague names/descriptions confuses the agent about which tool to pick; give each tool a short, specific description of exactly when to use it.
