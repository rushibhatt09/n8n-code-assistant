---
title: Split In Batches / Loop Over Items
category: nodes
tags: [loop, batches, pagination, large-lists]
summary: Process a long list of items in smaller chunks or one at a time instead of all at once.
---

The "Loop Over Items (Split in Batches)" node breaks a large list into smaller groups (or single items) and loops your workflow over them repeatedly. Use it when calling an API that has rate limits, or when a downstream step needs to run individually per item rather than on the whole batch at once.

## How to set it up

1. Add the **Loop Over Items (Split in Batches)** node after the node producing your list of items.
2. Set **Batch Size** to how many items you want processed per loop (use `1` to handle items one at a time).
3. Connect the node's **loop** output to the nodes that should run per batch.
4. At the end of that branch, connect the last node back to the **input** of the Loop node itself — this creates the loop that keeps pulling the next batch.
5. Connect the node's **done** output to whatever should run after all batches finish.
6. n8n automatically tracks progress and stops looping once every item has been processed.

```json
{
  "batchSize": 1,
  "options": {}
}
```

Example use: looping through 500 leads and calling an API once per lead with a small delay, using a Wait node inside the loop to respect a rate limit of 1 request per second.

## Ready-to-paste example

Pasting this creates a Manual Trigger that generates a small list of leads, then loops over them one at a time (calling an API and waiting 1 second between calls) until the "done" output fires.

```json
{
  "name": "Loop Over Leads Example",
  "nodes": [
    {
      "parameters": {},
      "id": "d2e3f4a5-0001-4d00-8e00-000000000001",
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [400, 300]
    },
    {
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "return [\n  { json: { leadId: 1, email: 'lead1@example.com' } },\n  { json: { leadId: 2, email: 'lead2@example.com' } },\n  { json: { leadId: 3, email: 'lead3@example.com' } }\n];"
      },
      "id": "d2e3f4a5-0002-4d00-8e00-000000000002",
      "name": "Sample Leads",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [620, 300]
    },
    {
      "parameters": {
        "batchSize": 1,
        "options": {}
      },
      "id": "d2e3f4a5-0003-4d00-8e00-000000000003",
      "name": "Loop Over Items",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [840, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "<YOUR_API_URL>/leads/{{ $json.leadId }}/contact",
        "sendBody": true,
        "contentType": "json",
        "jsonBody": "={{ { \"email\": $json.email } }}",
        "options": {}
      },
      "id": "d2e3f4a5-0004-4d00-8e00-000000000004",
      "name": "Contact Lead",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [1060, 200]
    },
    {
      "parameters": {
        "resume": "timeInterval",
        "amount": 1,
        "unit": "seconds"
      },
      "id": "d2e3f4a5-0005-4d00-8e00-000000000005",
      "name": "Wait 1s",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [1280, 200]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [
        [
          { "node": "Sample Leads", "type": "main", "index": 0 }
        ]
      ]
    },
    "Sample Leads": {
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
          { "node": "Contact Lead", "type": "main", "index": 0 }
        ]
      ]
    },
    "Contact Lead": {
      "main": [
        [
          { "node": "Wait 1s", "type": "main", "index": 0 }
        ]
      ]
    },
    "Wait 1s": {
      "main": [
        [
          { "node": "Loop Over Items", "type": "main", "index": 0 }
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

Note: the Loop node's first output is "done" (fires once, after all batches) and the second is "loop" (fires per batch) — this example wires the per-batch branch back into the loop's input, closing the loop.

Common mistake: forgetting to wire the last node in the loop branch back to the Loop node's input. Without that return connection, the node only processes a single batch and then stops — it looks like it's "not looping" when really the loop was never closed.
