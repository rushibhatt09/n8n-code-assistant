---
title: Set / Edit Fields Node
category: nodes
tags: [set, edit-fields, transform, mapping]
summary: Add, rename, or change field values on your data as it flows through the workflow.
---

The Set node (labeled "Edit Fields" in the node picker) lets you create new fields, rename existing ones, or overwrite values — like a spreadsheet formula for your workflow data. Use it whenever you need to reshape data before sending it somewhere else, such as combining a first and last name or adding a status flag.

## How to set it up

1. Add the **Edit Fields (Set)** node after the node whose data you want to change.
2. Choose **Mode**: "Manual Mapping" (add fields one by one in the UI) or "JSON" (write the whole output as JSON).
3. In Manual Mapping, click **Add Field**, give it a **Name**, pick a **Type** (String, Number, Boolean, Array, Object), and enter the **Value** — you can type an expression using `{{ }}` to pull from earlier nodes.
4. Turn on **Include Other Input Fields** if you want to keep the original data alongside your new/changed fields (off by default in newer versions — it replaces everything unless you enable this).
5. Click **Execute step** to check the output matches what you expect.

```json
{
  "mode": "manual",
  "duplicateItem": false,
  "assignments": {
    "assignments": [
      {
        "name": "fullName",
        "type": "string",
        "value": "={{ $json.firstName }} {{ $json.lastName }}"
      },
      {
        "name": "isVip",
        "type": "boolean",
        "value": "={{ $json.totalSpend > 1000 }}"
      }
    ]
  },
  "options": {
    "includeOtherFields": true
  }
}
```

## Ready-to-paste example

Pasting this creates a Manual Trigger with sample name/spend data feeding a Set node that builds a `fullName` field and an `isVip` flag while keeping the original fields.

```json
{
  "name": "Set Edit Fields Example",
  "nodes": [
    {
      "parameters": {},
      "id": "c2d3e4f5-0001-4c99-8d99-000000000001",
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
            { "name": "firstName", "type": "string", "value": "Jane" },
            { "name": "lastName", "type": "string", "value": "Doe" },
            { "name": "totalSpend", "type": "number", "value": 1500 }
          ]
        },
        "options": {}
      },
      "id": "c2d3e4f5-0002-4c99-8d99-000000000002",
      "name": "Sample Customer",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [680, 300]
    },
    {
      "parameters": {
        "mode": "manual",
        "duplicateItem": false,
        "assignments": {
          "assignments": [
            {
              "name": "fullName",
              "type": "string",
              "value": "={{ $json.firstName }} {{ $json.lastName }}"
            },
            {
              "name": "isVip",
              "type": "boolean",
              "value": "={{ $json.totalSpend > 1000 }}"
            }
          ]
        },
        "options": {
          "includeOtherFields": true
        }
      },
      "id": "c2d3e4f5-0003-4c99-8d99-000000000003",
      "name": "Edit Fields",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [900, 300]
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
          { "node": "Edit Fields", "type": "main", "index": 0 }
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

Common mistake: leaving **Include Other Fields** (or "Keep Only Set" in older versions) in its default state and then losing all the other data fields you needed later in the workflow. Always check this setting when the next node complains that a field "doesn't exist" — it was probably dropped here.
