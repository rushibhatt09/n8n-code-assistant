---
title: Working with JSON in the Code Node
category: concepts
tags: [code-node, json, javascript, data-transformation]
summary: How to read, transform, and return JSON data using JavaScript inside n8n's Code node.
---

The Code node lets you write JavaScript to transform data when the built-in nodes aren't flexible enough. n8n passes data into the Code node as a list of "items," and you must return data in that same item format.

## How to use the Code node

1. Add a **Code** node after the node whose data you want to transform.
2. Choose the mode: **Run Once for All Items** (you control looping yourself) or **Run Once for Each Item** (n8n loops for you, and you just work with one item at a time).
3. Write JavaScript that reads from `$input` and returns an array of objects, each shaped like `{ json: {...} }`.
4. Click "Test step" to preview the output.

## Example: transforming an array of items (Run Once for All Items)

```javascript
// Get all incoming items
const items = $input.all();

// Build a new array with only the fields we want
const result = items.map(item => {
  return {
    json: {
      name: item.json.first_name + ' ' + item.json.last_name,
      email: item.json.email.toLowerCase(),
    }
  };
});

return result;
```

## Example: working with a nested JSON object

```javascript
const data = $input.first().json;

// data.orders is an array of order objects
const totalSpent = data.orders.reduce((sum, order) => sum + order.amount, 0);

return [{ json: { customer: data.name, totalSpent } }];
```

## Example: splitting one item into many

```javascript
const items = $input.first().json.products;

return items.map(product => ({ json: product }));
```

## Ready-to-paste example

This complete workflow uses a Code node to reshape incoming JSON (combining name fields, lowercasing email) — import it, run it, and edit the sample data in the Set node to try your own fields.

```json
{
  "name": "Transform JSON in Code Node",
  "nodes": [
    {
      "parameters": {},
      "id": "8a2c073b-8888-4a2b-8c3d-000000000001",
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            { "id": "a1", "name": "first_name", "value": "<PLACEHOLDER_FIRST_NAME>", "type": "string" },
            { "id": "a2", "name": "last_name", "value": "<PLACEHOLDER_LAST_NAME>", "type": "string" },
            { "id": "a3", "name": "email", "value": "<PLACEHOLDER_EMAIL@EXAMPLE.COM>", "type": "string" }
          ]
        },
        "options": {}
      },
      "id": "8a2c073b-8888-4a2b-8c3d-000000000002",
      "name": "Set Sample Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [460, 300]
    },
    {
      "parameters": {
        "jsCode": "const items = $input.all();\n\nconst result = items.map(item => {\n  return {\n    json: {\n      name: item.json.first_name + ' ' + item.json.last_name,\n      email: item.json.email.toLowerCase(),\n    }\n  };\n});\n\nreturn result;"
      },
      "id": "8a2c073b-8888-4a2b-8c3d-000000000003",
      "name": "Code",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
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
          { "node": "Code", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": { "executionOrder": "v1" }
}
```

## Common mistake

Returning plain objects instead of wrapping them in `{ json: ... }`. Writing `return items;` where `items` is just `[{name: "a"}, {name: "b"}]` will cause an error or unexpected behavior — n8n expects `[{ json: { name: "a" } }, { json: { name: "b" } }]`. Always wrap each item's data inside a `json` key.
