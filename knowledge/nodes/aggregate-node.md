---
title: Aggregate Node
category: nodes
tags: [aggregate, combine, array, summarize]
summary: Combine many separate items into a single item containing a list (array) of their values.
---

The Aggregate node takes many items flowing through your workflow and merges them into one single item, usually as a list (array) of values or of full objects. Use it when you need to send a batch of records as one payload, e.g. emailing a summary list or posting an array to an API in one request.

## How to set it up

1. Add the **Aggregate** node after the items you want to combine.
2. Choose **Aggregate**: "Aggregate All Item Data" (bundle whole items) or "Aggregate Individual Fields" (pull out and combine specific fields).
3. For "Aggregate Individual Fields," click **Add Field to Aggregate** and enter the field name, e.g. `email` — this produces one item with an `email` array containing every item's email.
4. For "Aggregate All Item Data," set the **Destination Field Name** (e.g. `orders`) — this produces one item with an `orders` array, where each entry is a full original item.
5. Optionally enable **Include Binary Data** if you're aggregating file attachments as well.
6. Execute the node and confirm you now have exactly one output item containing everything.

```json
{
  "aggregate": "aggregateAllItemData",
  "destinationFieldName": "orders",
  "options": {}
}
```

```json
{
  "aggregate": "aggregateIndividualFields",
  "fieldsToAggregate": {
    "fieldToAggregate": [
      { "fieldToAggregate": "email", "renameField": false }
    ]
  }
}
```

## Ready-to-paste example

Pasting this into n8n (Ctrl+V on the canvas) gives you a Manual Trigger with sample order items feeding an Aggregate node that bundles every item's `email` field into one array.

```json
{
  "name": "Aggregate Emails Example",
  "nodes": [
    {
      "parameters": {},
      "id": "a1b2c3d4-0001-4a11-8b11-000000000001",
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "mode": "manual",
        "duplicateItem": false,
        "assignments": {
          "assignments": [
            {
              "name": "email",
              "type": "string",
              "value": "customer1@example.com"
            }
          ]
        },
        "options": {}
      },
      "id": "a1b2c3d4-0002-4a11-8b11-000000000002",
      "name": "Sample Orders",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [680, 300]
    },
    {
      "parameters": {
        "aggregate": "aggregateIndividualFields",
        "fieldsToAggregate": {
          "fieldToAggregate": [
            { "fieldToAggregate": "email", "renameField": false }
          ]
        }
      },
      "id": "a1b2c3d4-0003-4a11-8b11-000000000003",
      "name": "Aggregate",
      "type": "n8n-nodes-base.aggregate",
      "typeVersion": 1,
      "position": [900, 300]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [
        [
          { "node": "Sample Orders", "type": "main", "index": 0 }
        ]
      ]
    },
    "Sample Orders": {
      "main": [
        [
          { "node": "Aggregate", "type": "main", "index": 0 }
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

Common mistake: expecting Aggregate to "summarize" data with sums or averages, like a spreadsheet total. Aggregate only bundles items into an array — it doesn't do math. To calculate sums, counts, or averages, use a Code node or the Summarize node instead.
