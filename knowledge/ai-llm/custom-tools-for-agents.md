---
title: Custom Tools for AI Agents
category: ai-llm
tags: [tools, http-request-tool, code-tool, ai-agent]
summary: Lets an AI Agent call your own API or run custom logic by attaching an HTTP Request Tool or Code Tool.
---

An AI Agent becomes far more useful when it can *do* things, not just talk. A "Tool" is a small, described action the agent can decide to call — like looking up an order status or fetching live data from your own system. n8n gives you **HTTP Request Tool** for calling any API, and **Code Tool** for running custom JavaScript logic, both pluggable straight into the AI Agent's Tool input.

## Setup steps

1. Add an **HTTP Request Tool** (for calling an external/internal API) or **Code Tool** (for custom logic) node.
2. Connect it to the **Tool** input of your **AI Agent** node.
3. Give the tool a clear **Name** (no spaces, e.g. `get_order_status`) and a **Description** explaining exactly when the agent should use it — this description is what the AI reads to decide.
4. For HTTP Request Tool: set the URL, method, and mark which parts are dynamic by defining **Tool Parameters** (the agent fills these in based on the user's request).
5. For Code Tool: write JavaScript that receives the agent's input and returns a result.
6. Test by asking the agent a question that should trigger the tool, then check the execution log to confirm it was called with sensible values.

```json
{
  "parameters": {
    "name": "get_order_status",
    "description": "Look up the current shipping status of a customer order. Input: the order ID as a string.",
    "url": "https://api.dermatouch.com/orders/{{ $fromAI('orderId', 'The order ID to look up') }}/status",
    "method": "GET"
  },
  "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
  "typeVersion": 1.1
}
```

Example Code Tool logic:

```javascript
// Input: items[0].json.query (provided by the agent)
const query = $input.item.json.query;
const total = query.split(" ").length;
return { wordCount: total };
```

## Ready-to-paste example

This workflow lets a chat agent either call a live API tool (order status) or run a small custom Code Tool (word count), depending on what the user asks.

```json
{
  "name": "Agent With HTTP And Code Tools",
  "nodes": [
    {
      "parameters": {},
      "id": "a1b2c3d4-cccc-4890-abcd-ef1234567890",
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
          "systemMessage": "You are a support assistant. Use the tools available to answer accurately."
        }
      },
      "id": "b2c3d4e5-dddd-4901-bcde-f12345678901",
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
      "id": "c3d4e5f6-eeee-4012-cdef-123456789012",
      "name": "OpenAI Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.2,
      "position": [300, 500],
      "credentials": {
        "openAiApi": {
          "id": "1",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "name": "get_order_status",
        "description": "Look up the current shipping status of a customer order. Input: the order ID as a string.",
        "url": "https://api.<PLACEHOLDER>.com/orders/{{ $fromAI('orderId', 'The order ID to look up') }}/status",
        "method": "GET"
      },
      "id": "d4e5f6a7-ffff-4123-def0-234567890123",
      "name": "HTTP Request Tool",
      "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
      "typeVersion": 1.1,
      "position": [500, 500]
    },
    {
      "parameters": {
        "name": "count_words",
        "description": "Count the number of words in a piece of text the user provides.",
        "jsCode": "const query = $input.item.json.query;\nconst total = query.split(\" \").length;\nreturn { wordCount: total };"
      },
      "id": "e5f6a7b8-0001-4234-ef01-345678901234",
      "name": "Code Tool",
      "type": "@n8n/n8n-nodes-langchain.toolCode",
      "typeVersion": 1.1,
      "position": [680, 500]
    }
  ],
  "connections": {
    "When chat message received": {
      "main": [[{ "node": "AI Agent", "type": "main", "index": 0 }]]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [[{ "node": "AI Agent", "type": "ai_languageModel", "index": 0 }]]
    },
    "HTTP Request Tool": {
      "ai_tool": [[{ "node": "AI Agent", "type": "ai_tool", "index": 0 }]]
    },
    "Code Tool": {
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

Writing a vague tool description like "fetches data" — the agent can't tell when to use it and either ignores it or calls it at the wrong time. Be specific: state what the tool does, what input it expects, and any limits (e.g. "Only use this for orders placed in the last 90 days").
