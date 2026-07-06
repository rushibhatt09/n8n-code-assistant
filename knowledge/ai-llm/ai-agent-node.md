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

## Ready-to-paste example

This workflow starts from a chat window, sends the message to an AI Agent that has a short-term memory and one live tool (order status lookup), and replies in the same chat.

```json
{
  "name": "Dermatouch Support Agent",
  "nodes": [
    {
      "parameters": {},
      "id": "a1b2c3d4-e5f6-4890-abcd-ef1234567890",
      "name": "When chat message received",
      "type": "@n8n/n8n-nodes-langchain.chatTrigger",
      "typeVersion": 1.1,
      "position": [220, 300]
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.chatInput }}",
        "options": {
          "systemMessage": "You are a support assistant for Dermatouch. Answer using the tools provided. If you don't know, say so."
        }
      },
      "id": "b2c3d4e5-f6a7-4901-bcde-f12345678901",
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [440, 300]
    },
    {
      "parameters": {
        "model": "gpt-4o-mini",
        "options": {
          "temperature": 0.3
        }
      },
      "id": "c3d4e5f6-a7b8-4012-cdef-123456789012",
      "name": "OpenAI Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.2,
      "position": [340, 500],
      "credentials": {
        "openAiApi": {
          "id": "1",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "={{ $json.sessionId }}",
        "contextWindowLength": 10
      },
      "id": "d4e5f6a7-b8c9-4123-def0-234567890123",
      "name": "Window Buffer Memory",
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "typeVersion": 1.3,
      "position": [500, 500]
    },
    {
      "parameters": {
        "name": "get_order_status",
        "description": "Look up the current shipping status of a customer order. Input: the order ID as a string.",
        "url": "https://api.dermatouch.com/orders/{{ $fromAI('orderId', 'The order ID to look up') }}/status",
        "method": "GET"
      },
      "id": "e5f6a7b8-c9d0-4234-ef01-345678901234",
      "name": "HTTP Request Tool",
      "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
      "typeVersion": 1.1,
      "position": [660, 500]
    }
  ],
  "connections": {
    "When chat message received": {
      "main": [[{ "node": "AI Agent", "type": "main", "index": 0 }]]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [[{ "node": "AI Agent", "type": "ai_languageModel", "index": 0 }]]
    },
    "Window Buffer Memory": {
      "ai_memory": [[{ "node": "AI Agent", "type": "ai_memory", "index": 0 }]]
    },
    "HTTP Request Tool": {
      "ai_tool": [[{ "node": "AI Agent", "type": "ai_tool", "index": 0 }]]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

## Common mistake

Forgetting to attach a **Chat Model** node — the AI Agent node cannot run without one connected to its Model input, and n8n will show a red error on the node until you do. Also, adding too many tools with vague names/descriptions confuses the agent about which tool to pick; give each tool a short, specific description of exactly when to use it.
