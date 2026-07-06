---
title: Code Node (JavaScript)
category: nodes
tags: [code, javascript, custom-logic, expressions]
summary: Write your own JavaScript when built-in nodes can't do the exact data transformation you need.
---

The Code node lets you write custom JavaScript to transform, calculate, or filter data in ways the standard nodes can't handle — like complex math, string parsing, or looping logic. Use it as a last resort when Set/IF/Filter nodes aren't flexible enough.

## How to set it up

1. Add the **Code** node.
2. Set **Mode** to "Run Once for All Items" (process everything together, you control looping) or "Run Once for Each Item" (n8n loops for you, and you just return one item's data).
3. Access incoming data with `$input.all()` (all items) or `$input.item` (current item, in "each item" mode).
4. Use `$json` inside a loop as shorthand for the current item's data.
5. Use `$node["Node Name"].json` to grab data from a specific earlier node by name.
6. Return an array of objects, each wrapped as `{ json: {...} }` — this is the format every n8n node expects.
7. Click **Execute step** and check the output tab for errors or unexpected shapes.

```js
// Mode: Run Once for All Items
const items = $input.all();

const results = items.map(item => {
  const price = item.json.price;
  const qty = item.json.quantity;
  return {
    json: {
      ...item.json,
      total: price * qty,
      isBulkOrder: qty >= 10
    }
  };
});

return results;
```

```js
// Mode: Run Once for Each Item
const price = $json.price;
const qty = $json.quantity;

return {
  json: {
    ...$json,
    total: price * qty
  }
};
```

## Ready-to-paste example

Pasting this creates a Manual Trigger feeding sample price/quantity data into a Code node that calculates a total and a bulk-order flag for each item.

```json
{
  "name": "Code Node Total Calculation Example",
  "nodes": [
    {
      "parameters": {},
      "id": "b1c2d3e4-0001-4b22-8c22-000000000001",
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
            { "name": "price", "type": "number", "value": 25 },
            { "name": "quantity", "type": "number", "value": 12 }
          ]
        },
        "options": {}
      },
      "id": "b1c2d3e4-0002-4b22-8c22-000000000002",
      "name": "Sample Order",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [680, 300]
    },
    {
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const items = $input.all();\n\nconst results = items.map(item => {\n  const price = item.json.price;\n  const qty = item.json.quantity;\n  return {\n    json: {\n      ...item.json,\n      total: price * qty,\n      isBulkOrder: qty >= 10\n    }\n  };\n});\n\nreturn results;"
      },
      "id": "b1c2d3e4-0003-4b22-8c22-000000000003",
      "name": "Calculate Total",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
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
          { "node": "Calculate Total", "type": "main", "index": 0 }
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

Common mistake: forgetting to wrap each returned object in `{ json: {...} }`. If you `return items.map(i => i.json.total)` (a plain array of numbers), n8n will error or produce broken data — every item passed between nodes must be an object with a `json` key.
