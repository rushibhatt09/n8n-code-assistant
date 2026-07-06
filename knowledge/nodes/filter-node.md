---
title: Filter Node
category: nodes
tags: [filter, condition, data-cleaning]
summary: Keep only the items that match a condition and drop the rest, with a single output.
---

The Filter node checks each item against a condition and only lets matching items continue — everything else is dropped. Use it when you want to narrow down a list, like keeping only orders over $50, without needing separate true/false branches like the IF node provides.

## How to set it up

1. Add the **Filter** node after your data source.
2. Under **Conditions**, click **Add Condition**.
3. Choose the data type (String, Number, Boolean, Date, Array) for the field you're checking.
4. Set **Value 1** to the field, e.g. `{{ $json.orderTotal }}`.
5. Pick an **Operator**, e.g. "is greater than."
6. Set **Value 2**, e.g. `50`.
7. Add more conditions if needed and choose **Combinator** ("AND" or "OR").
8. Only one output exists — items that fail the condition are simply removed, not routed anywhere.

```json
{
  "conditions": {
    "options": {
      "caseSensitive": true,
      "typeValidation": "strict"
    },
    "conditions": [
      {
        "leftValue": "={{ $json.orderTotal }}",
        "rightValue": 50,
        "operator": {
          "type": "number",
          "operation": "gt"
        }
      }
    ],
    "combinator": "and"
  }
}
```

## Ready-to-paste example

Pasting this creates a Manual Trigger with a sample order feeding a Filter node that only lets orders over $50 continue.

```json
{
  "name": "Filter Orders Over 50 Example",
  "nodes": [
    {
      "parameters": {},
      "id": "d1e2f3a4-0001-4d44-8e44-000000000001",
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
            { "name": "orderTotal", "type": "number", "value": 75 }
          ]
        },
        "options": {}
      },
      "id": "d1e2f3a4-0002-4d44-8e44-000000000002",
      "name": "Sample Order",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [680, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "leftValue": "={{ $json.orderTotal }}",
              "rightValue": 50,
              "operator": {
                "type": "number",
                "operation": "gt"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "d1e2f3a4-0003-4d44-8e44-000000000003",
      "name": "Filter",
      "type": "n8n-nodes-base.filter",
      "typeVersion": 2.2,
      "position": [900, 300]
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
          { "node": "Filter", "type": "main", "index": 0 }
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

Common mistake: using Filter when you actually need both the matching AND non-matching items later in the workflow. Filter has only one output for the items that pass — anything that fails the condition disappears silently. If you need to handle both groups, use an IF node instead, which gives you separate true/false outputs.
