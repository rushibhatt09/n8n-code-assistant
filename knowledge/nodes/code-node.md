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

Common mistake: forgetting to wrap each returned object in `{ json: {...} }`. If you `return items.map(i => i.json.total)` (a plain array of numbers), n8n will error or produce broken data — every item passed between nodes must be an object with a `json` key.
