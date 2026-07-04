---
title: Cannot Read Properties of Undefined in Code Node or Expressions
category: troubleshooting
tags: [code-node, expressions, javascript-errors, data-structure]
summary: Fix "Cannot read properties of undefined" by checking your data's actual shape before accessing nested fields.
---

## "Cannot read properties of undefined (reading 'x')"

This is a JavaScript error, and it shows up when you (or an expression) try to reach into a piece of data that isn't there. For example, you write `item.json.customer.email`, but on some incoming item there is no `customer` object at all — so n8n can't go one level deeper to find `email`. It's not a bug in n8n; it's a mismatch between what your code expects and what the data actually looks like.

### How to fix it

1. Open the node that's failing and click a red item in the input panel to inspect its real JSON structure.
2. Look for the field mentioned in the error (e.g. `customer`) — check if it's missing, spelled differently, or nested somewhere else on some items but not others.
3. In a **Code** node, guard every nested access with optional chaining instead of assuming the path always exists.
4. In an **Expression** field (the ones with `{{ }}`), do the same — add `?.` before diving deeper.
5. If a field is sometimes missing, add a fallback with `??` so the workflow doesn't stop.

```javascript
// Inside a Code node
for (const item of $input.all()) {
  item.json.email = item.json.customer?.email ?? "unknown@example.com";
}
return $input.all();
```

```text
// In an expression field
{{ $json.customer?.email ?? "no email" }}
```

6. Re-run the node (click "Test step") and confirm no items throw the error anymore.

### Common mistake

People assume every item coming out of a previous node (like an HTTP Request or a Split In Batches) has the exact same shape. In reality, APIs often return optional fields — a customer without a phone number, an order without a discount object — and the very first item you tested with just happened to have everything filled in. Always test with a few different real items, not just one.
