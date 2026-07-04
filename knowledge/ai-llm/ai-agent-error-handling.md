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

## Common mistake

Leaving the default "Stop Workflow On Error" setting on an AI node that's part of a customer-facing flow (like a chatbot) — a single rate-limit blip then breaks the entire conversation with no reply at all. Always pair AI nodes with either retry settings or an error output branch that at least returns a polite "please try again" message.
