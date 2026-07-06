---
title: Switch Node
category: nodes
tags: [switch, routing, branching, multi-path]
summary: Route data down one of several paths based on matching a value, like a multi-way IF.
---

The Switch node routes each item to one of several outputs depending on its value — think of it as an IF node with more than two branches. Use it when you have categories like order status ("new," "shipped," "cancelled") and want a separate path of nodes to handle each one.

## How to set it up

1. Add the **Switch** node after your data source.
2. Choose **Mode**: "Rules" (define conditions per output) or "Expression" (calculate an output index/name with one expression).
3. In Rules mode, click **Add Routing Rule** for each branch you need, give each one an **Output Name** (e.g. "New," "Shipped," "Cancelled"), and set a condition, e.g. `{{ $json.status }}` equals `shipped`.
4. Turn on **Fallback Output** if you want a catch-all path for items that don't match any rule (name it something like "Other").
5. Connect each numbered/named output to its own branch of downstream nodes.

```json
{
  "mode": "rules",
  "rules": {
    "values": [
      {
        "conditions": {
          "conditions": [
            {
              "leftValue": "={{ $json.status }}",
              "rightValue": "shipped",
              "operator": { "type": "string", "operation": "equals" }
            }
          ],
          "combinator": "and"
        },
        "outputKey": "Shipped"
      },
      {
        "conditions": {
          "conditions": [
            {
              "leftValue": "={{ $json.status }}",
              "rightValue": "cancelled",
              "operator": { "type": "string", "operation": "equals" }
            }
          ],
          "combinator": "and"
        },
        "outputKey": "Cancelled"
      }
    ]
  },
  "options": {
    "fallbackOutput": "extra"
  }
}
```

## Ready-to-paste example

Pasting this creates a Manual Trigger with a sample order feeding a Switch node that routes to "Shipped," "Cancelled," or a fallback "Other" branch based on the order's status.

```json
{
  "name": "Switch Order Status Example",
  "nodes": [
    {
      "parameters": {},
      "id": "e2f3a4b5-0001-4e11-8f11-000000000001",
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
            { "name": "status", "type": "string", "value": "shipped" }
          ]
        },
        "options": {}
      },
      "id": "e2f3a4b5-0002-4e11-8f11-000000000002",
      "name": "Sample Order",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [680, 300]
    },
    {
      "parameters": {
        "mode": "rules",
        "rules": {
          "values": [
            {
              "conditions": {
                "conditions": [
                  {
                    "leftValue": "={{ $json.status }}",
                    "rightValue": "shipped",
                    "operator": { "type": "string", "operation": "equals" }
                  }
                ],
                "combinator": "and"
              },
              "outputKey": "Shipped"
            },
            {
              "conditions": {
                "conditions": [
                  {
                    "leftValue": "={{ $json.status }}",
                    "rightValue": "cancelled",
                    "operator": { "type": "string", "operation": "equals" }
                  }
                ],
                "combinator": "and"
              },
              "outputKey": "Cancelled"
            }
          ]
        },
        "options": {
          "fallbackOutput": "extra"
        }
      },
      "id": "e2f3a4b5-0003-4e11-8f11-000000000003",
      "name": "Switch",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3.2,
      "position": [900, 300]
    },
    {
      "parameters": {
        "name": "Shipped Handler"
      },
      "id": "e2f3a4b5-0004-4e11-8f11-000000000004",
      "name": "Shipped Handler",
      "type": "n8n-nodes-base.noOp",
      "typeVersion": 1,
      "position": [1120, 150]
    },
    {
      "parameters": {
        "name": "Cancelled Handler"
      },
      "id": "e2f3a4b5-0005-4e11-8f11-000000000005",
      "name": "Cancelled Handler",
      "type": "n8n-nodes-base.noOp",
      "typeVersion": 1,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "name": "Other Handler"
      },
      "id": "e2f3a4b5-0006-4e11-8f11-000000000006",
      "name": "Other Handler",
      "type": "n8n-nodes-base.noOp",
      "typeVersion": 1,
      "position": [1120, 450]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [
        [
          { "node": "Sample Order", "type": "main", "index": 0 }
        ]
      ]
    },
    "Sample Order": {
      "main": [
        [
          { "node": "Switch", "type": "main", "index": 0 }
        ]
      ]
    },
    "Switch": {
      "main": [
        [
          { "node": "Shipped Handler", "type": "main", "index": 0 }
        ],
        [
          { "node": "Cancelled Handler", "type": "main", "index": 0 }
        ],
        [
          { "node": "Other Handler", "type": "main", "index": 0 }
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

Common mistake: not enabling **Fallback Output**, so any item that doesn't exactly match a rule (e.g. unexpected status like "returned") simply disappears from the workflow with no error and no trace. Always add a fallback branch, even if it just logs or alerts on unmatched items.
