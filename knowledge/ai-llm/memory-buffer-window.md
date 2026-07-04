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

## Common mistake

Using the same fixed Session Key for every user (e.g. leaving it as a static string like "default") — this makes all users share one memory, so User A's messages leak into User B's conversation. Always map the session key to something unique per user or chat, like a phone number, email, or chat ID.
