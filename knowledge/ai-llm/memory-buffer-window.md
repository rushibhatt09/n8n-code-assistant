---
title: Memory - Window Buffer Memory
category: ai-llm
tags: [memory, conversation, window-buffer, ai-agent]
summary: Gives an AI Agent the ability to remember recent messages so a conversation feels continuous.
---

By default, every message you send to an AI Agent is treated as brand new — it has no idea what you talked about a moment ago. **Window Buffer Memory** fixes this by storing the last few messages of a conversation and feeding them back to the model each time, so it can refer to earlier context (like "what did I just ask you?").

## Setup steps

1. Add a **Window Buffer Memory** node to your canvas.
2. Connect it to the **Memory** input of your **AI Agent** (or Basic LLM Chain) node.
3. Set **Context Window Length** — this is how many previous messages (not characters) it keeps, e.g. 10.
4. Set a **Session Key** so separate conversations don't blend together. For a chat trigger, use something like `{{ $json.sessionId }}` or the chat's unique user ID.
5. Choose the **Session ID Type**: "Connected Chat Trigger Node" (automatic) or "Define Below" (manual expression) depending on your trigger.
6. Test by sending two messages in a row in the chat panel — the second message should reference the first correctly.

```json
{
  "parameters": {
    "sessionIdType": "customKey",
    "sessionKey": "={{ $json.sessionId }}",
    "contextWindowLength": 10
  },
  "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
  "typeVersion": 1.3
}
```

## Ready-to-paste example

This workflow gives a chat-based AI Agent a 10-message memory window, keyed per conversation so users don't see each other's history.

```json
{
  "name": "Agent With Session Memory",
  "nodes": [
    {
      "parameters": {},
      "id": "a1b2c3d4-8888-4890-abcd-ef1234567890",
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
          "systemMessage": "You are a helpful assistant that remembers the ongoing conversation."
        }
      },
      "id": "b2c3d4e5-9999-4901-bcde-f12345678901",
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [440, 300]
    },
    {
      "parameters": {
        "model": "gpt-4o-mini",
        "options": {
          "temperature": 0.5
        }
      },
      "id": "c3d4e5f6-aaaa-4012-cdef-123456789012",
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
      "id": "d4e5f6a7-bbbb-4123-def0-234567890123",
      "name": "Window Buffer Memory",
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "typeVersion": 1.3,
      "position": [540, 500]
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
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

## Common mistake

Using the same fixed Session Key for every user (e.g. leaving it as a static string like "default") — this makes all users share one memory, so User A's messages leak into User B's conversation. Always map the session key to something unique per user or chat, like a phone number, email, or chat ID.
