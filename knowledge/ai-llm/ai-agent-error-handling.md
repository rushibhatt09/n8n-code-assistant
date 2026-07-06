---
title: AI Agent Error Handling
category: ai-llm
tags: [error-handling, rate-limits, timeout, retry]
summary: How to catch AI Agent failures like timeouts and rate limits so your workflow degrades gracefully instead of crashing.
---

AI nodes call external APIs (OpenAI, Anthropic, etc.), which can fail: rate limits during high traffic, timeouts on slow responses, or invalid API keys. Without handling this, your whole workflow execution fails and the user gets nothing. n8n gives you node-level retry/error settings plus the **Error Trigger** and node "Error Output" connection to build a graceful fallback.

## Setup steps

1. Open your **AI Agent** (or Chat Model) node's settings (the gear/three-dot menu) and enable **Retry On Fail**, setting a reasonable retry count (e.g. 2–3) and wait time between tries — this alone handles many transient rate-limit errors.
2. Set **On Error** to **Continue Using Error Output** instead of the default "Stop Workflow" — this creates a second output branch specifically for errors.
3. Connect that error output to a fallback path: a **Set** node returning a friendly default message, or a **Slack/Email** node alerting your team.
4. For workflow-wide safety, add a global **Error Trigger** node in a separate workflow, and set your main workflow's **Settings → Error Workflow** to point to it, so any unhandled failure gets logged/notified centrally.
5. If using multiple providers, consider a fallback chain: try OpenAI Chat Model first, and on error route to an Anthropic Chat Model branch as backup.
6. Test by temporarily using an invalid API key to confirm your error path actually triggers instead of failing silently.

```json
{
  "parameters": {},
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 1.7,
  "onError": "continueErrorOutput",
  "retryOnFail": true,
  "maxTries": 3,
  "waitBetweenTries": 5000
}
```

## Ready-to-paste example

This workflow runs an AI Agent with retry settings and an error output branch so a rate-limit or timeout failure still returns a polite fallback message instead of crashing the chat.

```json
{
  "name": "Agent With Error Fallback",
  "nodes": [
    {
      "parameters": {},
      "id": "a1b2c3d4-0143-4890-abcd-ef1234567890",
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
          "systemMessage": "You are a support assistant for Dermatouch. Answer using the tools provided."
        }
      },
      "id": "b2c3d4e5-0154-4901-bcde-f12345678901",
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [440, 300],
      "onError": "continueErrorOutput",
      "retryOnFail": true,
      "maxTries": 3,
      "waitBetweenTries": 5000
    },
    {
      "parameters": {
        "model": "gpt-4o-mini",
        "options": {
          "temperature": 0.3
        }
      },
      "id": "c3d4e5f6-0165-4012-cdef-123456789012",
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
        "name": "get_order_status",
        "description": "Look up the current shipping status of a customer order. Input: the order ID as a string.",
        "url": "https://api.dermatouch.com/orders/{{ $fromAI('orderId', 'The order ID to look up') }}/status",
        "method": "GET",
        "retryOnFail": true,
        "maxTries": 2
      },
      "id": "d4e5f6a7-0176-4123-def0-234567890123",
      "name": "HTTP Request Tool",
      "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
      "typeVersion": 1.1,
      "position": [540, 500]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "f6a7b8c9-0187-4234-ef01-345678901234",
              "name": "chatOutput",
              "type": "string",
              "value": "Sorry, I'm having trouble reaching the AI service right now — please try again in a moment."
            }
          ]
        }
      },
      "id": "e5f6a7b8-0198-4234-ef01-345678901234",
      "name": "Fallback Message",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [660, 300]
    }
  ],
  "connections": {
    "When chat message received": {
      "main": [[{ "node": "AI Agent", "type": "main", "index": 0 }]]
    },
    "AI Agent": {
      "main": [
        [],
        [{ "node": "Fallback Message", "type": "main", "index": 0 }]
      ]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [[{ "node": "AI Agent", "type": "ai_languageModel", "index": 0 }]]
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

Note: the AI Agent's second `main` output array above is its **error output** branch (only present when "Continue Using Error Output" is enabled) — index 0 is the normal success path, index 1 fires only on failure.

## Common mistake

Leaving the default "Stop Workflow On Error" setting on an AI node that's part of a customer-facing flow (like a chatbot) — a single rate-limit blip then breaks the entire conversation with no reply at all. Always pair AI nodes with either retry settings or an error output branch that at least returns a polite "please try again" message.
