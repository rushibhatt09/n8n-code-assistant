---
title: Expression Returns Undefined or Null When Data Structure Changes
category: troubleshooting
tags: [expressions, data-structure, undefined, dynamic-data]
summary: Fix expressions that silently return nothing by handling items whose field names or nesting vary between runs.
---

## Expression shows blank, "undefined," or "null" instead of the expected value

Unlike a hard crash, this failure mode is quiet — the expression just evaluates to nothing and the workflow keeps going with missing data. It happens when the field you're referencing exists on *some* items but not others, or when an upstream node (an API, a Switch/IF branch, or a merge) sometimes changes the shape of the data — a field renamed, nested differently, or simply absent for certain records.

### How to fix it

1. Click through several different items in the node's input panel (not just item 1) to see if the field name or nesting actually varies.
2. If a field is sometimes at a different path, use optional chaining (`?.`) so it doesn't throw, and pair it with a fallback default so downstream nodes always get something usable.
3. If the field is renamed depending on a data source (e.g. `full_name` vs `name`), add a small **Code** or **Set** node earlier to normalize field names before they flow further.
4. Use `$json` for the current item, but double check you're not accidentally referencing `$node["NodeName"].json` from a node that isn't guaranteed to have run for every branch (common after IF/Switch nodes).

```text
// Expression with safe fallback
{{ $json.customer?.name ?? $json.full_name ?? "Unknown" }}
```

```javascript
// Code node: normalize inconsistent field names before continuing
return $input.all().map(item => {
  const name = item.json.customer?.name ?? item.json.full_name ?? item.json.name ?? null;
  return { json: { ...item.json, normalizedName: name } };
});
```

5. Add a **Filter** or **IF** node after normalization to route items still missing critical data to a separate path (e.g. for manual review) instead of letting `null` silently flow to an API call further downstream.

## Drop-in fix

Paste this Code node in place of the node feeding your unreliable expression — it normalizes several possible field name/shape variants into one reliable field before anything downstream reads it, so expressions like `{{ $json.customerName }}` always resolve to something usable.

```javascript
// Drop-in Code node: normalize inconsistent field shapes into stable output fields
return $input.all().map(item => {
  const data = item.json ?? {};

  const customerName =
    data.customer?.name ??
    data.full_name ??
    data.name ??
    "<DEFAULT_NAME>";

  const customerEmail =
    data.customer?.email ??
    data.email_address ??
    data.email ??
    null;

  const isComplete = customerEmail !== null;

  return {
    json: {
      ...data,
      customerName,
      customerEmail,
      needsReview: !isComplete,
    },
  };
});
```

Then use the normalized fields safely downstream, e.g. `{{ $json.customerName }}` and `{{ $json.customerEmail ?? "no email on file" }}`, and route items where `needsReview` is `true` to a separate branch with an **IF** node.

### Common mistake

Building and testing the workflow using only the one sample item n8n cached from your first test run, which happens to have every field filled in — then being surprised weeks later when real-world data with missing or differently-shaped fields quietly breaks downstream steps.
