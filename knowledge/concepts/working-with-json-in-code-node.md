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

## Common mistake

Returning plain objects instead of wrapping them in `{ json: ... }`. Writing `return items;` where `items` is just `[{name: "a"}, {name: "b"}]` will cause an error or unexpected behavior — n8n expects `[{ json: { name: "a" } }, { json: { name: "b" } }]`. Always wrap each item's data inside a `json` key.
