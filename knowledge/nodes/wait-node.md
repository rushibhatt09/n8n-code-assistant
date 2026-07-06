---
title: Wait Node
category: nodes
tags: [wait, delay, pause, rate-limit]
summary: Pause a workflow for a set time, until a specific date, or until an external webhook call resumes it.
---

The Wait node pauses your workflow before continuing to the next step. Use it to space out API calls to respect rate limits, delay a follow-up message, or pause until a specific date/time or until an external system calls back to resume the flow.

## How to set it up

1. Add the **Wait** node where you want the pause to happen.
2. Choose **Resume**: "After Time Interval," "At Specified Time," or "On Webhook Call."
3. For "After Time Interval," set the **Wait Amount** and **Unit** (seconds, minutes, hours, days).
4. For "At Specified Time," pick the exact **Date and Time** to resume.
5. For "On Webhook Call," n8n generates a unique URL — the workflow pauses until that URL receives a request (useful for approval steps, e.g. "click this link to approve").
6. Note: workflows paused longer than a few minutes are stored on disk (not kept in memory), so this works even after a server restart, as long as n8n stays running/deployed.

```json
{
  "resume": "timeInterval",
  "amount": 1,
  "unit": "seconds"
}
```

```json
{
  "resume": "webhook",
  "options": {
    "webhookSuffix": "approve-order"
  }
}
```

## Ready-to-paste example

Pasting this creates a Manual Trigger that calls an API, then pauses for 2 seconds (to respect a rate limit) before a second API call.

```json
{
  "name": "Wait Between API Calls Example",
  "nodes": [
    {
      "parameters": {},
      "id": "f2a3b4c5-0001-4f22-8a22-000000000001",
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "method": "GET",
        "url": "<YOUR_API_URL>/status",
        "options": {}
      },
      "id": "f2a3b4c5-0002-4f22-8a22-000000000002",
      "name": "First API Call",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "resume": "timeInterval",
        "amount": 2,
        "unit": "seconds"
      },
      "id": "f2a3b4c5-0003-4f22-8a22-000000000003",
      "name": "Wait",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "method": "GET",
        "url": "<YOUR_API_URL>/status",
        "options": {}
      },
      "id": "f2a3b4c5-0004-4f22-8a22-000000000004",
      "name": "Second API Call",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [1120, 300]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [
        [
          { "node": "First API Call", "type": "main", "index": 0 }
        ]
      ]
    },
    "First API Call": {
      "main": [
        [
          { "node": "Wait", "type": "main", "index": 0 }
        ]
      ]
    },
    "Wait": {
      "main": [
        [
          { "node": "Second API Call", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

Common mistake: adding a Wait node inside a loop to slow down API calls, but setting the amount too low (or forgetting it entirely) and still hitting the API's rate limit — resulting in failed requests further down the workflow. Check the target API's documented rate limit and set the Wait duration with some safety margin, not the bare minimum.
