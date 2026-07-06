---
title: Rate Limiting and Backoff Strategies in n8n
category: concepts
tags: [rate-limiting, backoff, api, throttling]
summary: How to slow down n8n workflows so you don't exceed an API's rate limits and get temporarily blocked.
---

Most APIs only allow a certain number of requests per minute or second. If you send too many too fast, they respond with errors (often HTTP 429 "Too Many Requests") or temporarily block your account. n8n gives you a few simple ways to pace your requests.

## Adding a delay between requests

1. If you're looping over many items (e.g., using **Loop Over Items (Split in Batches)**), add a **Wait** node inside the loop, after your API call node.
2. Set the Wait node to **Wait Amount** and specify seconds (e.g., 1 second) between each iteration.
3. For HTTP Request nodes with built-in pagination, use the **Interval Between Requests** option under Pagination settings instead of a separate Wait node.

## Combining retry with exponential backoff

1. On the HTTP Request node, open **Settings** and enable **Retry On Fail**.
2. Set **Max Tries** (e.g., 5) and increase **Wait Between Tries** to give the API breathing room (e.g., 3000ms).
3. For true exponential backoff (delay doubling each retry), use a Code node before the request to calculate the wait dynamically, or catch 429 errors with Continue Using Error Output and route them into a Wait node before looping back to retry.

## Example: batch processing with a fixed delay

```
Loop Over Items (batch size: 1)
  -> HTTP Request (call API)
  -> Wait (1 second)
  -> back to Loop Over Items
```

## Example: reading a rate-limit header to decide how long to wait

```javascript
// Code node after HTTP Request, using item.headers if "Include Response Headers" is on
const remaining = Number($json.headers['x-ratelimit-remaining']);
const resetSeconds = Number($json.headers['x-ratelimit-reset']);

return [{ json: { remaining, waitSeconds: remaining === 0 ? resetSeconds : 0 } }];
```

## Ready-to-paste example

This complete workflow processes items one at a time using Loop Over Items, calls an API, and waits 1 second between each call to avoid hitting a rate limit — import it and change the URL.

```json
{
  "name": "Rate-Limited API Loop",
  "nodes": [
    {
      "parameters": {},
      "id": "6e4a291f-6666-4a2b-8c3d-000000000001",
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "batchSize": 1,
        "options": {}
      },
      "id": "6e4a291f-6666-4a2b-8c3d-000000000002",
      "name": "Loop Over Items",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [460, 300]
    },
    {
      "parameters": {
        "url": "=<API_ENDPOINT_URL>/{{ $json.id }}",
        "options": {}
      },
      "id": "6e4a291f-6666-4a2b-8c3d-000000000003",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [680, 220]
    },
    {
      "parameters": {
        "amount": 1
      },
      "id": "6e4a291f-6666-4a2b-8c3d-000000000004",
      "name": "Wait",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [900, 220]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [
        [
          { "node": "Loop Over Items", "type": "main", "index": 0 }
        ]
      ]
    },
    "Loop Over Items": {
      "main": [
        [],
        [
          { "node": "HTTP Request", "type": "main", "index": 0 }
        ]
      ]
    },
    "HTTP Request": {
      "main": [
        [
          { "node": "Wait", "type": "main", "index": 0 }
        ]
      ]
    },
    "Wait": {
      "main": [
        [
          { "node": "Loop Over Items", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": { "executionOrder": "v1" }
}
```

## Common mistake

Processing all items at once with no batching or delay, assuming n8n's speed is fine because "it's just an API call." n8n can fire requests very quickly in a loop, and without batching (Loop Over Items) plus a Wait node, you can burn through an API's rate limit in seconds and get your account throttled or banned.
