---
title: IF Node
category: nodes
tags: [if, conditional, branching, logic]
summary: Split your workflow into two paths (true/false) based on a condition you define.
---

The IF node checks a condition on each item of data and sends it down one of two paths: **true** or **false**. Use it whenever a workflow needs to behave differently depending on a value — for example, sending a different email to VIP customers versus regular ones.

## How to set it up

1. Add the **IF** node after the data you want to check.
2. Under **Conditions**, click **Add Condition**.
3. Choose the data type (String, Number, Boolean, Date, Array).
4. Set the **Value 1** field to the value you're testing, e.g. `{{ $json.totalSpend }}`.
5. Pick an **Operator**, e.g. "is greater than," "equals," "contains."
6. Enter **Value 2** to compare against, e.g. `1000`.
7. If you add multiple conditions, choose **Combinator**: "AND" (all must be true) or "OR" (any can be true).
8. Connect the **true** output to one branch of nodes and the **false** output to another.

```json
{
  "conditions": {
    "options": {
      "caseSensitive": true,
      "leftValue": "",
      "typeValidation": "strict"
    },
    "conditions": [
      {
        "leftValue": "={{ $json.totalSpend }}",
        "rightValue": 1000,
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

Pasting this creates a Manual Trigger with a sample customer feeding an IF node that splits VIP customers (spend over 1000) from regular ones into two branches, each ending in a Set node.

```json
{
  "name": "IF VIP Customer Example",
  "nodes": [
    {
      "parameters": {},
      "id": "f1a2b3c4-0001-4f66-8a66-000000000001",
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
            { "name": "totalSpend", "type": "number", "value": 1500 }
          ]
        },
        "options": {}
      },
      "id": "f1a2b3c4-0002-4f66-8a66-000000000002",
      "name": "Sample Customer",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [680, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "leftValue": "={{ $json.totalSpend }}",
              "rightValue": 1000,
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
      "id": "f1a2b3c4-0003-4f66-8a66-000000000003",
      "name": "Is VIP?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [900, 300]
    },
    {
      "parameters": {
        "mode": "manual",
        "duplicateItem": false,
        "assignments": {
          "assignments": [
            { "name": "emailTemplate", "type": "string", "value": "vip-thank-you" }
          ]
        },
        "options": {}
      },
      "id": "f1a2b3c4-0004-4f66-8a66-000000000004",
      "name": "VIP Branch",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [1120, 200]
    },
    {
      "parameters": {
        "mode": "manual",
        "duplicateItem": false,
        "assignments": {
          "assignments": [
            { "name": "emailTemplate", "type": "string", "value": "standard-thank-you" }
          ]
        },
        "options": {}
      },
      "id": "f1a2b3c4-0005-4f66-8a66-000000000005",
      "name": "Regular Branch",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [1120, 400]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [
        [
          { "node": "Sample Customer", "type": "main", "index": 0 }
        ]
      ]
    },
    "Sample Customer": {
      "main": [
        [
          { "node": "Is VIP?", "type": "main", "index": 0 }
        ]
      ]
    },
    "Is VIP?": {
      "main": [
        [
          { "node": "VIP Branch", "type": "main", "index": 0 }
        ],
        [
          { "node": "Regular Branch", "type": "main", "index": 0 }
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

Common mistake: comparing a number field against a text value (or vice versa) and getting unexpected results, e.g. `"10" > "9"` evaluating as string comparison instead of numeric. Always double-check the data **type** dropdown on each condition matches the actual type of the value coming in — use the Set node earlier to force a field to Number if you're not sure.
