---
title: n8n Expressions Basics
category: concepts
tags: [expressions, json, variables, basics]
summary: How to use n8n's {{ }} expression syntax to pull data from previous nodes into any field.
---

An "expression" is a small piece of code you type inside `{{ }}` in any n8n field. It lets a field show data from earlier in your workflow instead of typing it in by hand.

## How to use it in the n8n UI

1. Click into any node field (like a URL, message body, or parameter).
2. Click the small expression icon (looks like "fx" or an equals sign) next to the field, or just start typing `{{`.
3. Inside the curly braces, write a reference to the data you want.
4. n8n shows a live preview below the field so you can see the actual value before running the workflow.
5. Press outside the field to save.

## Key variables you'll use constantly

- `$json` — the JSON data of the item currently being processed, coming from the node right before this one.
- `$node["Node Name"].json` — data from any specific earlier node, by name.
- `$now` — the current date/time.
- `$input.item.json` — another way to reference the current item's data.

```
{{ $json.email }}
```

```
{{ $node["HTTP Request"].json.data[0].id }}
```

```
{{ $now.toFormat('yyyy-MM-dd') }}
```

You can also mix plain text with expressions:

```
Hello {{ $json.firstName }}, your order #{{ $json.orderId }} shipped on {{ $now.toFormat('dd LLL yyyy') }}.
```

## Ready-to-paste example

This complete workflow uses a Set node with expressions that reference data from a prior node, showing several common expression patterns together — import it and inspect the Set node's fields to see live expressions.

```json
{
  "name": "Expressions Demo",
  "nodes": [
    {
      "parameters": {},
      "id": "4c6e4f1d-4444-4a2b-8c3d-000000000001",
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "assign-1",
              "name": "firstName",
              "value": "<PLACEHOLDER_FIRST_NAME>",
              "type": "string"
            },
            {
              "id": "assign-2",
              "name": "orderId",
              "value": "1001",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "4c6e4f1d-4444-4a2b-8c3d-000000000002",
      "name": "Set Sample Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [460, 300]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "assign-3",
              "name": "greeting",
              "value": "={{ 'Hello ' + $json.firstName + ', your order #' + $json.orderId + ' shipped on ' + $now.toFormat('dd LLL yyyy') }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "4c6e4f1d-4444-4a2b-8c3d-000000000003",
      "name": "Build Greeting",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [680, 300]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [
        [
          { "node": "Set Sample Data", "type": "main", "index": 0 }
        ]
      ]
    },
    "Set Sample Data": {
      "main": [
        [
          { "node": "Build Greeting", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": { "executionOrder": "v1" }
}
```

## Common mistake

Forgetting the double curly braces, or only using one `{`. If you type `$json.email` without `{{ }}`, n8n treats it as plain text, not a live reference — the field will literally show `$json.email` instead of the actual email address. Always wrap expressions in `{{ }}`.
